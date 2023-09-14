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