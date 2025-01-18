--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: films; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.films (
    code_film character varying(3) NOT NULL,
    titre_film character varying(255) NOT NULL,
    date_production_film date NOT NULL,
    sujet_film text,
    code_producteur character varying(3),
    code_realisateur character varying(3)
);


ALTER TABLE public.films OWNER TO postgres;

--
-- Name: jury; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jury (
    code character varying(5) NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    date_naissance date NOT NULL,
    nationalite character varying(100) NOT NULL,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.jury OWNER TO postgres;

--
-- Name: notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notes (
    id_note integer NOT NULL,
    code_film character varying(50) NOT NULL,
    code character varying(50) NOT NULL,
    note integer NOT NULL,
    CONSTRAINT notes_note_check CHECK (((note >= 1) AND (note <= 10)))
);


ALTER TABLE public.notes OWNER TO postgres;

--
-- Name: notes_id_note_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notes_id_note_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notes_id_note_seq OWNER TO postgres;

--
-- Name: notes_id_note_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notes_id_note_seq OWNED BY public.notes.id_note;


--
-- Name: producteurs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.producteurs (
    code_producteur character varying(3) NOT NULL,
    nom_producteur character varying(255) NOT NULL,
    prenom_producteur character varying(255) NOT NULL,
    date_naissance_producteur date
);


ALTER TABLE public.producteurs OWNER TO postgres;

--
-- Name: realisateurs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.realisateurs (
    code_realisateur character varying(50) NOT NULL,
    nom_realisateur character varying(255) NOT NULL,
    prenom_realisateur character varying(255) NOT NULL,
    date_naissance_realisateur date
);


ALTER TABLE public.realisateurs OWNER TO postgres;

--
-- Name: utilisateurs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateurs (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    username character varying(100) NOT NULL,
    mot_de_passe character varying(100) NOT NULL,
    role character varying(30) DEFAULT 'user'::character varying
);


ALTER TABLE public.utilisateurs OWNER TO postgres;

--
-- Name: utilisateurs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilisateurs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilisateurs_id_seq OWNER TO postgres;

--
-- Name: utilisateurs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateurs_id_seq OWNED BY public.utilisateurs.id;


--
-- Name: notes id_note; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes ALTER COLUMN id_note SET DEFAULT nextval('public.notes_id_note_seq'::regclass);


--
-- Name: utilisateurs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs ALTER COLUMN id SET DEFAULT nextval('public.utilisateurs_id_seq'::regclass);


--
-- Data for Name: films; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.films (code_film, titre_film, date_production_film, sujet_film, code_producteur, code_realisateur) FROM stdin;
001	vie sans humour 	2004-09-14	la vie qui n'est  pas facile 	001	001
002	le pasteur eglezias	2014-12-15	un pasteur qui passe à détourner ses fidèle du droit chemin 	002	002
003	À la vie, à la mort !	1995-09-14	Sur la côte marseillaise, une petite tribu a ses habitudes au cabaret de Joséfa, le « Perroquet Bleu » qui périclite faute de clients. Les copains marginaux ou en perdition sociale se rassemblent au bar : il y a Jaco, chômeur et malheureux en ménage, Patrick, un autre chômeur marié avec Marie-Sol, femme de ménage qui ne tarde pas à rejoindre leur clan après avoir refusé les avances de son patron et enfin Otto, un ancien légionnaire. Le bon ami de Joséfa, José, qui fait office de barman, recueille un jour Vénus, une jeune droguée.	003	003
004	destruction	2011-05-04	ce film met en exergue les crises géopolitiques dans les pays en sous développement notamment l'Afrique(sierra leone)	00A	004
005	le danseur fou	2001-02-01	la danse d'une terreur appelé zougoulou magic	006	005
AAA	naruto	2002-07-07	l'histoire d'un homme qui n'abandonne pas 	005	006
AA4	cesarienne	1996-04-30	met en exergue les accouchements terribles des femmes	ABC	007
007	Divan à Tunis	2019-07-04	Ce film illustre Une comédie sociale confrontant avec humour les défis culturels et administratifs de la Tunisie postrévolutionnaire	007	BDB
AAB	La nuit des rois	2020-12-04	Ce film relate un drame mystique sur le pouvoir et la narration dans une prison ivoirienne	BD4	ACB
010	hjcqbj	1785-05-03	dnodsk,o	010	010
410	bringo	2001-02-15	ce film relate des hommes partant pour de l'or 	F45	ZSC
Q11	akashi	2024-02-07	l'homme qui ne perd jamais 	Q74	452
011	la vie en avion	2013-06-14	un enfant qui voyage en avion seul	450	A41
451	gnac	2021-05-04	motivation de la semaine	K14	AZE
452	gnac2	2023-12-14	motivation de la semaine juillet 	K13	AZ3
100	gnac3	2024-11-28	motivation de la semaine juillet 	O12	741
W11	AUsecours	1990-12-01	histoire de sauvetage de film RAMBO 	L10	A70
W10	AUsecours2	1910-12-13	histoire de sauvetage de film RAMBO 2	L10	A70
411	SUR LA DUNE DE LA SOLITUDE	1964-04-06	film tiré de la déesse de l'eau mamie WAtta  séduit les humains	B21	N23
785	la vie en machine	2011-07-14	ce film retrace l'homme soldat devenu une machine à tuer après un combat	A85	Q01
Q40	EUROPE00	2000-12-14	la vie en EUROPE DANS les années 90	A41	A10
Q24	la destruction5	2004-12-14	la destruction est science fiction le monde dans chaos  total	B10	B01
Q41	EUROPE01	2025-01-20	la vie en EUROPE DANS les années 90	A41	A10
420	EREUR 444	2025-04-01	il s'agit lors de sa presatation il va connaître une nouvelle erreur qui se dénomme "erreur404	V41	A74
\.


--
-- Data for Name: jury; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jury (code, nom, prenom, date_naissance, nationalite, date_creation) FROM stdin;
j450	obodji	yuki	1990-02-14	Française	2025-01-01 16:32:41.50974
jk41	uchiwa 	sassuke	2004-04-01	Japon	2025-01-01 16:56:40.557278
j029	uzumaki 	naruto	1980-10-25	Espagne	2025-01-01 17:05:13.103152
J120	KOFFI	KOUADIO ERIC	1996-02-02	Côte d'Ivoire	2025-01-02 16:43:45.934231
J145	david	karnou	1990-12-14	Arménie	2025-01-03 00:58:31.433872
j002	Omar	Said	1990-05-22	Bahreïn	2025-01-03 13:14:37.838987
j003	Leila	Khaled	2013-06-05	Albanie	2025-01-03 13:21:17.738118
j004	Leilaa	Khaled	2013-06-05	Arabie saoudite	2025-01-03 13:23:40.611398
\.


--
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notes (id_note, code_film, code, note) FROM stdin;
1	003	j002	5
2	002	j002	5
3	004	J145	7
4	AA4	j003	5
5	001	J120	7
\.


--
-- Data for Name: producteurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.producteurs (code_producteur, nom_producteur, prenom_producteur, date_naissance_producteur) FROM stdin;
001	freapeak	antetokoupo	1984-04-14
002	leaonardo	givinciin	1988-12-16
003	melisi	jean-louis	1956-08-03
00A	koudou	jean francis	1978-12-26
006	ZNENDER	Vichi	1969-07-04
005	yogoru	mikasa	1970-09-04
ABC	BEFRTRAND	Christophe Lamar	1959-01-08
007	leaonardo	josua junior	1998-01-14
BD4	DELPHINE	Jacquet	1973-08-23
010	bjdnkqo	dbjkdq	1978-12-14
A27	SEBASTIEN	Clairvoyant Sordide	1975-04-04
Q74	RUIZ	Ferdinand	1982-07-14
F45	HESNEST	luck	1969-07-25
450	SOURIS	Jean Sezan	1990-11-02
K14	KORUMIN	Cédric	2000-06-04
K13	CHRISTIAN	Cédric	1990-12-13
O12	LOIC	JEUNE	1997-07-26
L10	LEANDRRON	Filmin	1894-05-03
B21	DAIMA	Emmanuel	1930-09-04
A85	LOIC	Footbalter	1978-12-15
A41	CRIST	ANGELO	1969-02-15
B10	CHRIST	Saint-Jean	1990-12-13
V41	LOIC	Footba	1985-12-14
\.


--
-- Data for Name: realisateurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.realisateurs (code_realisateur, nom_realisateur, prenom_realisateur, date_naissance_realisateur) FROM stdin;
001	BDB	boyfriend	1986-07-14
002	soubre	rockanez sandro	1990-07-15
003	Guédiguian	Robert	1953-12-03
004	pikre	jean silvert	1975-12-14
005	CRIQUET	Plureder	1965-12-04
006	mashashi 	kishimoto	1978-05-02
007	songui	ouodjo	1964-12-14
BDB	LABIDI	Mamele	1982-08-07
ACB	LACOTE	Philippe	1969-09-05
010	njdnk	bjdjn	2001-12-14
A12	GONGUI	douce-malone	1978-10-14
012	songui	ouattara	1975-02-12
452	OUATT	tresor	1985-10-14
ZSC	ZERGUE	Richard	1972-05-04
A41	SOHATE	Kratis	1990-05-14
AZE	AZERBAN	Rodrique	1997-12-04
AZ3	EBRU	Saint-Jean	2000-06-14
741	AZERBA	Rodrique	2024-12-13
A70	AMEKAN	Justin	1890-05-14
N23	BASSORI	Timité	1933-12-30
Q01	LIGHT 	kagami	1986-02-25
A10	YAO	Vincent	1970-08-15
B01	PAU	Victor	1986-09-14
A74	KAOUKOU	Esnest	1975-02-14
\.


--
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateurs (id, nom, prenom, email, username, mot_de_passe, role) FROM stdin;
1	hamed	meite	hamedmeite05@gmail.com	inspecteur	$2b$10$f5MHubpAZjh5g2hEdB4G3OnIXDpOzOib69ffrROTvKDJTu.dDxQG6	user
2	hamed	meite	hamedmeite@gmail.com	INSPECTEUR2	$2b$10$cusS2tfJLXPgyge3s1QY0.5PT6n3LAGWmY6ImFor.rOSe1DJZ4e8C	inspecteur
3	koffi	gnireleila	gnireleila@gmail.com	GNIRE88	$2b$10$l7SbCH3bxrpeML4PBECkweVCIMfBIqY9RSnp0VY56r.niTnFDOUt2	jurys
4	YEO	Nalougo	yeonalougo@gmail.com	nalougo123	$2b$10$J8IdMkhMzqFN/V4g5b8gSOr1yHHGAxK4VP6JfOADqnYeL/OKbxFhi	presidentjury
5	JALil	HARBAR	jalilhabar05@gmail.com	jalil120	$2b$10$qR7MwqvVBeTM3aepcKefMOL2oaulvJ6nZvZStcEsgF5COEuv8l1f2	producteur
6	Omar	Said	omarsaid@gmail.com	OMAR44	$2b$10$snrjyr0cg68dIQl7csOS2e.m/jJ1Rygrcgcw.kgvFyjPlUdtmDtwS	user
7	david	karnou	karnoudavid@gmail.com	karnou120	$2b$10$OR0y5CaVaxJFkK33Ywa2wO.ug8XmObc08Jc0mHaoCvIoBeSc6hI/6	user
\.


--
-- Name: notes_id_note_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notes_id_note_seq', 5, true);


--
-- Name: utilisateurs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateurs_id_seq', 7, true);


--
-- Name: films films_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.films
    ADD CONSTRAINT films_pkey PRIMARY KEY (code_film);


--
-- Name: jury jury_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jury
    ADD CONSTRAINT jury_pkey PRIMARY KEY (code);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id_note);


--
-- Name: producteurs producteurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producteurs
    ADD CONSTRAINT producteurs_pkey PRIMARY KEY (code_producteur);


--
-- Name: realisateurs realisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realisateurs
    ADD CONSTRAINT realisateurs_pkey PRIMARY KEY (code_realisateur);


--
-- Name: films unique_titre_film; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.films
    ADD CONSTRAINT unique_titre_film UNIQUE (titre_film);


--
-- Name: utilisateurs utilisateurs_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_email_key UNIQUE (email);


--
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (id);


--
-- Name: utilisateurs utilisateurs_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_username_key UNIQUE (username);


--
-- Name: films films_code_producteur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.films
    ADD CONSTRAINT films_code_producteur_fkey FOREIGN KEY (code_producteur) REFERENCES public.producteurs(code_producteur);


--
-- Name: films films_code_realisateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.films
    ADD CONSTRAINT films_code_realisateur_fkey FOREIGN KEY (code_realisateur) REFERENCES public.realisateurs(code_realisateur);


--
-- Name: notes notes_code_film_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_code_film_fkey FOREIGN KEY (code_film) REFERENCES public.films(code_film) ON DELETE CASCADE;


--
-- Name: notes notes_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_code_fkey FOREIGN KEY (code) REFERENCES public.jury(code) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

