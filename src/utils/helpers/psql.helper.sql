-- When user created it creates a new dictionary which name is "initial" for that user 

create or replace function create_inital_dic_on_user()
returns trigger as $$

declare 
	initial_slug varchar(30):='intial_'||new.email;
	
begin

insert into "Dictionaries"("authorId",title,slug) values (new.id,'initial',initial_slug);
return new;
end;
$$ language plpgsql;

create trigger initial_dictionary
after insert on "Users"
for each row 
execute function create_inital_dic_on_user()

-- This psql code declare a couple of integer for our loop and with help of select command it sets a variable and then when looping update the datas of "Dictionaries"

DO $$ 
DECLARE
    row_count integer;
    min_value integer := 0;
    max_value integer := 5;
BEGIN
    -- Get the total number of rows in your table
    SELECT COUNT(*) INTO row_count FROM "Dictionaries";

    -- Loop through each row and update the "rate" column with a random integer
    FOR i IN 1..row_count LOOP
        UPDATE "Dictionaries"
        SET rate = floor(random() * (max_value - min_value + 1) + min_value)
        WHERE id = i; -- Change "id" to the actual primary key column of your table
    END LOOP;
END $$;
