-- public.products definition

-- Drop table

-- DROP TABLE public.products;

CREATE TABLE public.products (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	category varchar(100) NOT NULL,
	store varchar(100) NOT NULL,
	price numeric(10, 2) NOT NULL,
	active bool NULL DEFAULT true,
	quantity int4 NOT NULL DEFAULT 0,
	CONSTRAINT products_pkey PRIMARY KEY (id)
);


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);


-- public.carts definition

-- Drop table

-- DROP TABLE public.carts;

CREATE TABLE public.carts (
	id serial4 NOT NULL,
	userid int4 NULL,
	createdat timestamp NOT NULL,
	updatedat timestamp NOT NULL,
	CONSTRAINT carts_pkey PRIMARY KEY (id),
	CONSTRAINT carts_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id)
);


-- public.orders definition

-- Drop table

-- DROP TABLE public.orders;

CREATE TABLE public.orders (
	id serial4 NOT NULL,
	productid int4 NOT NULL,
	userid int4 NOT NULL,
	quantity int4 NOT NULL,
	totalprice float8 NOT NULL,
	createdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT orders_pkey PRIMARY KEY (id),
	CONSTRAINT fk_orders_productid FOREIGN KEY (productid) REFERENCES public.products(id) ON DELETE CASCADE,
	CONSTRAINT fk_orders_userid FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE
);


-- public.cartitems definition

-- Drop table

-- DROP TABLE public.cartitems;

CREATE TABLE public.cartitems (
	id serial4 NOT NULL,
	cartid int4 NULL,
	productid int4 NULL,
	quantity int4 NOT NULL,
	CONSTRAINT cartitems_pkey PRIMARY KEY (id),
	CONSTRAINT cartitems_cartid_fkey FOREIGN KEY (cartid) REFERENCES public.carts(id),
	CONSTRAINT cartitems_productid_fkey FOREIGN KEY (productid) REFERENCES public.products(id)
);