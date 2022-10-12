import { FC } from "react";
import { TextField, Stack, Button } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { InvestmentSchema, Investment } from "../../Investment";
import { dateSchema } from "../../utils";

async function getInvestmentById(id: string) {
  const res = await fetch(`/api/investments/${id}`);

  return InvestmentSchema.parse(await res.json());
}

function useInvestment(id: string) {
  return useQuery(["investment", id], () => getInvestmentById(id));
}

async function updateInvestmentById(
  id: string,
  investment: Partial<Omit<Investment, "id" | "status">>
) {
  const res = await fetch(`/api/investments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(investment),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.ok;
}

function useUpdateInvestment(id: string) {
  const client = useQueryClient();

  return useMutation(
    (investment: Partial<Omit<Investment, "id" | "status">>) =>
      updateInvestmentById(id, investment),
    {
      onMutate: async () => {
        await client.cancelQueries(["investments"]);
        await client.cancelQueries(["investment", id]);
      },
      onSettled: async () => {
        await client.invalidateQueries(["investments"]);
        await client.invalidateQueries(["investment", id]);
      },
    }
  );
}

const EditInvestment = z.object({
  name: z.string(),
  return: z.number(),
  fundingCapital: z.number(),
  investmentTerm: z.number(),
  fundingEnd: dateSchema,
});

const InvestmentEdit: FC = () => {
  const investmentId = useParams<{
    investmentId: string;
  }>().investmentId!;

  const mutation = useUpdateInvestment(investmentId);

  const { id, status, ...rest } = useInvestment(investmentId).data!;
  const {
    control,
    handleSubmit,
  } = useForm({
    defaultValues: rest,
    resolver: zodResolver(EditInvestment),
  });

  const handler = handleSubmit((val) => {
    mutation.mutate(val);
  });

  return (
    <form onSubmit={handler}>
      <Stack spacing={2}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <TextField {...field} label="Nome" />}
        />
        <Controller
          name="return"
          control={control}
          render={({ field: { onChange, ...fieldRest } }) => (
            <TextField
              {...fieldRest}
              onChange={(e) => onChange(parseInt(e.target.value))}
              label="Rendimento Annuo"
            />
          )}
        />
        <Controller
          name="investmentTerm"
          control={control}
          render={({ field: { onChange, ...fieldRest } }) => (
            <TextField
              {...fieldRest}
              onChange={(e) => onChange(parseInt(e.target.value))}
              label="Durata"
            />
          )}
        />
        <Controller
          name="fundingCapital"
          control={control}
          render={({ field: { onChange, ...fieldRest } }) => (
            <TextField
              {...fieldRest}
              onChange={(e) => onChange(parseInt(e.target.value))}
              label="Capitale"
            />
          )}
        />
        <Controller
          name="fundingEnd"
          control={control}
          render={({ field }) => (
            <DesktopDatePicker
              {...field}
              label="Termine investimento"
              renderInput={(params) => <TextField {...params} />}
            />
          )}
        />
        <Button variant="contained" type="submit">
          Salva
        </Button>
      </Stack>
    </form>
  );
};

export default InvestmentEdit;
