export type YookassaPayment = {
  id: string;
  status: 'pending' | 'succeeded';
  amount: { value: string; currency: 'RUB' };
  recipient: { account_id: string; gateway_id: string };
  created_at: string;
  confirmation: {
    type: 'redirect';
    confirmation_url: string;
  };
  test: boolean;
  paid: boolean;
  refundable: boolean;
  metadata: unknown;
};
