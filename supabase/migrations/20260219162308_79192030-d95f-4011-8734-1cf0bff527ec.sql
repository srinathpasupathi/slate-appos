
CREATE TABLE public.test_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.test_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on test_products" ON public.test_products FOR SELECT USING (true);

CREATE TABLE public.test_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.test_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on test_tasks" ON public.test_tasks FOR SELECT USING (true);
