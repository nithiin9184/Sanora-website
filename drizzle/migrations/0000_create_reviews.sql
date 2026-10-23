CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 40),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text text NOT NULL CHECK (char_length(btrim(text)) BETWEEN 1 AND 300),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can post a review" ON public.reviews FOR INSERT TO anon, authenticated WITH CHECK (true);

INSERT INTO public.reviews (name, rating, text, created_at) VALUES
('Arjun M.', 5, 'Imported my 1,200-song Spotify library in under a minute. The EQ is unreal.', now() - interval '12 days'),
('Priya S.', 5, 'Finally a player that respects AMOLED. Battery life went up noticeably.', now() - interval '11 days'),
('Rahul K.', 4, 'Lyrics sync is perfect. Coupon worked instantly for Pro.', now() - interval '10 days'),
('Sneha V.', 5, 'Bass boost + lo-fi warmth on my IEMs is chef''s kiss.', now() - interval '9 days'),
('Karthik R.', 5, 'Clean, fast, zero ads. Exactly what I wanted.', now() - interval '8 days'),
('Ananya D.', 4, 'Seeing my earbud battery in-app is such a nice touch.', now() - interval '7 days'),
('Rohit Sharma', 5, 'Bhai kya mast app hai! Sound quality ekdum clear, ads bilkul nahi. Spotify se playlist 2 minute mein aa gayi.', now() - interval '6 days'),
('Neha Gupta', 5, 'Lyrics sync bahut accha hai, gaate gaate maza aa jata hai. AMOLED mode se battery bhi bachti hai.', now() - interval '5 days'),
('Aman Verma', 4, 'Bass boost zabardast hai yaar, earphones mein alag hi feel aata hai. Bas thoda aur themes chahiye.', now() - interval '4 days'),
('Sai Teja', 5, 'Anna app super undi! Sound chala clear ga untundi, ads asalu levu. Naa JioSaavn playlist easy ga import ayyindi.', now() - interval '3 days'),
('Lakshmi Prasanna', 5, 'EQ settings chala baagunnayi, bass konchem penchithe pichi ekkipothundi. Telugu songs lyrics kuda correct ga vasthunnayi.', now() - interval '2 days'),
('Venkat Reddy', 4, 'Install cheyyadam chala easy, coupon code tho Pro vachesindi. Battery kuda takkuva theeskuntundi, nice app ra.', now() - interval '1 day');