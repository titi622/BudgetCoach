# Simulation Rules

## Step1 - Income

- Income is calculated regardless of `type`.
- Monthly income for each year is `af_tax / 12`.
- Starting from the next year, annual after-tax income grows by `growth_rate`.
- Annual income for year N is:

  annual_income = af_tax * (1 + growth_rate) ^ year_offset

- Monthly income is:

  monthly_income = annual_income / 12

  ## Step1 - Saving

- Saving is calculated regardless of `type`.
- Monthly amount is `payment`.
- `flowType` is treated as `income`.
- The event occurs until the month that includes `end_date`.
- If there is no effective expiration date, it occurs for the full 120 months.