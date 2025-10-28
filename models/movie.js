// Modelo de Filme
class Movie {
  constructor(id, title, genreId, actorIds) {
    this.id = id;
    this.title = title;
    this.genreId = genreId; // id do gênero
    this.actorIds = actorIds; // array de ids de atores
  }
}
module.exports = Movie;
