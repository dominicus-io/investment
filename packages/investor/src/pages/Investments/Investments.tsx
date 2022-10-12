import { FC, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  ButtonGroup,
  styled,
  Box,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { dateSchema } from "../../utils";

const InvestmentSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    return: z.number(),
    fundingCapital: z.number(),
    investmentTerm: z.number(),
    fundingEnd: dateSchema,
  })
  .transform((el) => ({
    ...el,
    status: el.fundingEnd > new Date() ? "active" : "closed",
  }));

const InvestmentsSchema = z.array(InvestmentSchema);

async function getInvestments(select: "all" | "closed" | "active" = "all") {
  const res = await fetch("/api/investments");
  const investments = InvestmentsSchema.parse(await res.json());
  return select === "all"
    ? investments
    : investments.filter((el) => el.status === select);
}

function useInvestments(select: "all" | "closed" | "active" = "all") {
  return useQuery(["investments", select], () => getInvestments(select));
}

async function deleteInvestmentById(id: string) {
  const res = await fetch(`/api/investments/${id}`, {
    method: "DELETE",
  });

  return res.ok;
}

function useDeleteInvestment() {
  const client = useQueryClient();
  return useMutation(deleteInvestmentById, {
    onMutate: async () => {
      await client.cancelQueries(["investments"]);
      await client.cancelQueries(["investment"]);
    },
    onSettled: async () => {
      await client.invalidateQueries(["investments"]);
      await client.invalidateQueries(["investment"]);
    },
  });
}

const Dot = styled("span")<{
  closed?: boolean;
}>(({ closed, theme }) => ({
  width: 8,
  height: 8,
  backgroundColor: closed
    ? theme.palette.error.main
    : theme.palette.success.main,
  borderRadius: "100%",
}));

const Investments: FC = () => {
  const [select, setSelect] = useState<"all" | "closed" | "active">("all");
  const investments = useInvestments(select).data!;
  const mutation = useDeleteInvestment();

  const investmentRows = useMemo(() => {
    return investments.map((el) => (
      <TableRow key={el.id}>
        <TableCell>
          <Box display="flex" alignItems="center" gap={1}>
            <Dot closed={el.fundingEnd < new Date()} />
            {el.name}
          </Box>
        </TableCell>
        <TableCell>{el.return}</TableCell>
        <TableCell>{el.investmentTerm}</TableCell>
        <TableCell>{el.fundingCapital}</TableCell>
        <TableCell>
          <ButtonGroup>
            <Button onClick={() => mutation.mutate(el.id)}>
              <Delete />
            </Button>
            <Button component={Link} to={`${el.id}/edit`}>
              <Edit />
            </Button>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    ));
  }, [investments, mutation]);

  return (
    <>
      <ToggleButtonGroup
        value={select}
        exclusive
        onChange={(_, filter) => setSelect(filter)}
      >
        <ToggleButton value="all">Tutti</ToggleButton>
        <ToggleButton value="active">Attivi</ToggleButton>
        <ToggleButton value="closed">Chiusi</ToggleButton>
      </ToggleButtonGroup>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Rendimento annuo</TableCell>
              <TableCell>Durata</TableCell>
              <TableCell>Capitale</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{investmentRows}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Investments;
