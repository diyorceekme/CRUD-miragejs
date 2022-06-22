import {
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField
} from "@mui/material";
import { useEffect, useState } from "react";

function App() {
  const [movies, setMovies] = useState(null)
  const [movieId, setMovieId] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  useEffect(() => {
    fetch('/api/movies')
      .then(res => res.json())
      .then(json => setMovies(json.movies))
      .catch(err => console.log(err))
  }, [])

  const creatingMovie = async () => {
    try {
      const res = await fetch('/api/movies', {
        method: "POST",
        body: JSON.stringify({
          name,
          year
        })
      })
      const json = await res.json()
      setMovies([...movies, json.movie])
      setName('')
      setYear('')
    } catch (error) {
      console.log(error)
    }
  }

  const updatingMovie = async () => {
    try {
      const res = await fetch(`/api/movies/${movieId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name,
          year
        })
      })
      const json = await res.json()
      const moviesCopy = [...movies]
      const index = movies.findIndex(m => m.id === movieId)
      moviesCopy[index] = json.movie
      setMovies(moviesCopy)
      setName('')
      setYear('')
      setUpdating(false)
      setMovieId(null)
    } catch (error) {
      console.log(error)
    }
  }

  const submitForm = async (event) => {
    event.preventDefault();

    if(updating){
      updatingMovie()
    }    else{
      creatingMovie()
    }
  }

  const deleteMovie = async (id) => {
    try {
      await fetch(`/api/movies/${id}`, { method: "DELETE" })

      setMovies(movies.filter(m => m.id !== id))
    } catch (error) {
      console.log(error);
    }
  }

  const setMovieToUpdate = (id) => {
    const movie = movies.find(m => m.id === id)
    setUpdating(true)
    setMovieId(movie.id)
    setName(movie.name)
    setYear(movie.year)
  }

  return (
    <>
    <Container>
      <div className="App" style={{ justifyContent: "center" }}>
        <h1 style={{ fontWeight: "normal", textAlign: "center", marginY: 3 }}>Movies</h1>
        <div style={{ marginY: 4 }}>
          <form onSubmit={submitForm}>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <div>
                <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <input type="number" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} />
              </div>
              <div>
                <button type="submit" style={{ backgroundColor: "#28a745", border: "none", color: "white" }}>
                  {updating ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </form>
        </div>
        {movies?.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: "white" }}>
                  #Id
                </TableCell>
                <TableCell style={{ color: "white" }}>
                  Name
                </TableCell>
                <TableCell style={{ color: "white" }}>
                  Year
                </TableCell>
                <TableCell style={{ color: "white" }}>
                  Actions
                </TableCell>
                <TableCell style={{ color: "white" }}>
                  
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movies.map(({ id, name, year }) => (
                <TableRow key={id}>
                  <TableCell style={{ color: "white" }}>
                    {id}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    {name}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    {year}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <button style={{ background: "#ffc107", border: "none", color: "white" }} onClick={() => setMovieToUpdate(id)}>Update</button>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <button style={{ background: "#dc3545", border: "none", color: "white" }} onClick={() => deleteMovie(id)}>Delete</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No movies</p>
        )}
      </div>
    </Container>
    </>
  );
}

export default App;
