const express=require("express");
const path=require("path");
const {open}=require("sqlite");
const sqlite3=require("sqlite3");
const app=express()
app.use(express.json());
const dbPath=path.join(__dirname,moviesData.db);
let db=null;
const initializeDbAndServer=async()=>
{
    try{
        db=await open({
            filename:dbPath;
            driver:sqlite3.Database;

        });
        app.listen(3000,()=>{
        console.log("server running at http://localhost:3000/");
    });
 }catch(e){
     console.log('DB error:${e.message}');
     process.exit(1);
 }
};
initializeDbAndServer();
const convertMovieNameToPascalCase=(dbObject)=>{
    return{
        movieName:dbObject.movie_name,
    };
};
app.get("/movies/",async(request,response)=>{
    const getAllMovieQuery=
    `select
    movie_name
    from 
    movie;`;
    const moviesArray=await db.all(getAllMovieQuery);
    response.send(
        moviesArray.map(moviename)=>convertMovieNameToPascalCase(moviename))
);
    });
app.post("/movies/",async(request,response)=>{
    const {directorId,movieName,leadActor}=request.body;
    const  addMovieQuery=` 
    INSERT Into 
    movie(director_id,movie_name,leadActor)
    VALUES
    {
        ${directorId},
        '${movieName}',
        '${leadActor}')`;
        const dbResponse=await db.run(addMovieQuery);
        response.send("Movie Successfully Added");
    });
    const convertDbObjectToResponseObject=(dbObject)=>{
        return{
            movieId:dbObject.movie_id;
            directorId:dbObject.director_id,
            movieName:dbObject.movie_name,
            leadActor:dbObject.lead_actor,
        };
    };
    app.get("/movies/",async(request,response)=>{
        const{movieId}=request.params;
        const getMovieQuery=`
        Select
        *
        FROM 
        movie 
        movie_id=${movieId};`;
        const movie=await db.get(getMovieQuery);
        console.log(movieId);
        response.send(convertDbObjectToResponseObject(movie));
    })
    app.put("/movies/:movieId/",async(request,response)=>{
           const{movieId}=request.params;
           const{directorId,movieName,leadActor}=request.body;
           const updateMovieQuery=`
           update
           movie
           set 
           director_id=${directorId},
           movie_name=${movieName},
           lead_actor=${leadActor}
           where
           movie_id=${movieId};`;
           await db.run(updateMovieQuery);
           response.send("Movie Details Updated");
        });
    app.delete("/movies/:movieId/",async(request,response)=>{
        const {movieId}=request.params;
        const deleteMovieQuery=`
        delete from 
        movie 
        where 
         movie_id=${movie_id};`;
         await db.run(deleteMovieQuery);
         response.send("Movie Removed");
});
const convertDirectorDetailsToPascalCase=(dbObject)=>{
    return{
        directorId:dbObject.director_id,
        directorName:dbObject.director_name; 
    }
    };
    app.get("/directors/",async(request,response)=>{
        const {directorId}=request.params;

        const getAllDirectorQuery=`
        select *
        from 
        director;`;
        const moviesArray==await db.all(getAllDirectorQuery);
        response.send(
            moviesArray.map((director)=>convertDirectorDetailsToPascalCase(director))
    };
        };
    app.get("/directors/:directorId/movies/",async(request,response)=>{
        const {directorId}=request.params;
        const getDirectorMovieQuery=`
        SELECT
        movie_name
        FROM
        director INNER JOIN movie
        on director.director_id=${directorId};`;
        const movies =await db.all(getDirectorMovieQuery);
        console.log(directorId);
        response.send(movies.map(movienames)=>convertMovieNameToPascalCase(movienames))
    );
    });
    module.exports=app;
    