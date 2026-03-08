
-- Allow deletes (admin handles auth at app level via password)
CREATE POLICY "Anyone can delete transactions" ON public.transactions FOR DELETE USING (true);
CREATE POLICY "Anyone can delete insights" ON public.insights FOR DELETE USING (true);
CREATE POLICY "Anyone can delete statements" ON public.statements FOR DELETE USING (true);
CREATE POLICY "Anyone can delete subscriptions" ON public.subscriptions FOR DELETE USING (true);
CREATE POLICY "Anyone can delete payment_requests" ON public.payment_requests FOR DELETE USING (true);
CREATE POLICY "Anyone can delete profiles" ON public.profiles FOR DELETE USING (true);
