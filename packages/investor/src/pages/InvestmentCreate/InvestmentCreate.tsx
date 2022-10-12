import { FC } from "react";
import { TextField, Stack, Button } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Investment } from "../../Investment";

async function createInvestment(investment: Omit<Investment, "id" | "status">) {
  const res = await fetch("/api/investments", {
    method: "POST",
    body: JSON.stringify(investment),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.ok;
}

function useCreateInvestment() {
  const client = useQueryClient();
  return useMutation(createInvestment, {
    onMutate: async () => {
      await client.cancelQueries(["investments"]);
    },
    onSettled: async () => {
      await client.invalidateQueries(["investments"]);
    },
  });
}

const InvestmentCreate: FC = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "Investment",
      return: 5,
      investmentTerm: 12,
      fundingCapital: 100_000,
      fundingEnd: new Date(Date.now() + 10_000_000_000),
    },
  });
  const mutation = useCreateInvestment();
  const navigate = useNavigate();
  const handler = handleSubmit((val) => {
    mutation.mutate(val);
    navigate("/investments");
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
          render={({ field }) => (
            <TextField {...field} label="Rendimento Annuo" />
          )}
        />
        <Controller
          name="investmentTerm"
          control={control}
          render={({ field }) => <TextField {...field} label="Durata" />}
        />
        <Controller
          name="fundingCapital"
          control={control}
          render={({ field }) => <TextField {...field} label="Capitale" />}
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

export default InvestmentCreate;
