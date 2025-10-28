// Modelo de Gênero
class Genre {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.movieIds = [];
  }
}
module.exports = Genre;
