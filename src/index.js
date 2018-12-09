import React, { Component } from "react";
import ReactDOM from "react-dom";
import superheroes_data from "./data";
import "./styles.css";

/*
 * Remove redundant categories
 */
const sanitizeCategory = superheroes => {
  let categories = [];
  superheroes.map((hero, i) => {
    let category = hero.category;
    if (!categories.includes(category)) categories.push(category);
  });
  return categories;
};

/*
 * Search superheroes by name
 */
const searchSuperheroes = (superheroes, key, keyword) => {
  let foundSuperheroes = [];
  let lowerCaseKeyword = keyword.toLowerCase();
  superheroes.map((hero, i) => {
    if (hero[key].toLowerCase().includes(lowerCaseKeyword))
      foundSuperheroes.push(hero);
  });
  return foundSuperheroes;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      superheroes: null,
      searchByName: "",
      searchByDesc: "",
      searchByCat: ""
    };
    this.renderFilterForm = this.renderFilterForm.bind(this);
    this.processSearch = this.processSearch.bind(this);
  }

  componentDidMount() {
    /*
     * Fetching superheroes data here. You can replace this with your GET request
     */
    this.setState({ superheroes: superheroes_data });
  }

  /*
   * Process searching here
   */
  processSearch() {
    const { searchByName, searchByDesc, searchByCat } = this.state;
    let foundSuperheroes = [];
    let hasKeyword = false;
    if (searchByName) {
      hasKeyword = true;
      foundSuperheroes = searchSuperheroes(
        superheroes_data,
        "name",
        searchByName
      );
    }
    if (
      searchByDesc &&
      ((hasKeyword && foundSuperheroes.length > 0) || !hasKeyword)
    ) {
      hasKeyword = true;
      foundSuperheroes =
        foundSuperheroes.length > 0 ? foundSuperheroes : superheroes_data;
      foundSuperheroes = searchSuperheroes(
        foundSuperheroes,
        "bio",
        searchByDesc
      );
    }
    if (
      searchByCat &&
      ((hasKeyword && foundSuperheroes.length > 0) || !hasKeyword)
    ) {
      hasKeyword = true;
      foundSuperheroes =
        foundSuperheroes.length > 0 ? foundSuperheroes : superheroes_data;
      foundSuperheroes = searchSuperheroes(
        foundSuperheroes,
        "category",
        searchByCat
      );
    }

    if (hasKeyword) {
      this.setState({ superheroes: foundSuperheroes });
    } else {
      this.setState({ superheroes: superheroes_data });
    }
  }

  /*
   * Adding Title, Description & Category field filter fields
   */
  renderFilterForm() {
    let categories = sanitizeCategory(superheroes_data);
    return (
      <div className="filter-area">
        <button
          className="reset-btn"
          onClick={() =>
            this.setState({
              searchByName: "",
              searchByDesc: "",
              searchByCat: "",
              superheroes: superheroes_data
            })
          }
        />
        <input
          type="text"
          placeholder="Search for a superhero"
          value={this.state.searchByName}
          onChange={e =>
            this.setState({ searchByName: e.target.value }, () =>
              this.processSearch()
            )
          }
        />
        <input
          type="text"
          placeholder="Search for description"
          value={this.state.searchByDesc}
          onChange={e =>
            this.setState({ searchByDesc: e.target.value }, () =>
              this.processSearch()
            )
          }
        />
        <select
          value={this.state.searchByCat}
          onChange={e =>
            this.setState({ searchByCat: e.target.value }, () =>
              this.processSearch()
            )
          }
        >
          <option value="">Search for a category</option>
          {categories.map((category, i) => {
            return (
              <option key={i} value={category}>
                {category}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  /*
   * Rendering superheroes table
   */
  renderSuperHeroes(superheroes) {
    return (
      <div className="data_table">
        <div className="header">
          <div>Name</div>
          <div>Bio</div>
        </div>
        <div className="body">
          {superheroes.map((hero, i) => {
            return (
              <div key={i} className="data_row">
                <div>{hero.name}</div>
                <div>
                  {hero.bio}
                  <div className="category">
                    Category: <b>{hero.category}</b>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  render() {
    const { superheroes } = this.state;

    return (
      <div className="App">
        <h1>React table with filter form.</h1>
        {this.renderFilterForm()}
        {superheroes && this.renderSuperHeroes(superheroes)}
        <div className="note">
          <p>
            <a target="_blank" href="https://github.com/loq24">
              Hire me!
            </a>{" "}
            Or buy me a{" "}
            <a target="_blank" href="https://www.paypal.me/loq24">
              beer
            </a>
            .
          </p>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
