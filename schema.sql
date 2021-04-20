DROP TABLE characters ;
CREATE TABLE IF NOT EXISTS characters (

 id SERIAL PRIMARY KEY NOT NULL,
  quote  VARCHAR(255) ,
  character VARCHAR(255) ,
  image  VARCHAR(255),
  characterDirection VARCHAR(255)
) ;


