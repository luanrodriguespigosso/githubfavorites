import { GithubUser } from "./githubUsers.js";
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username);

      if (userExists) {
        throw new Error("Usuário já cadastrado");
      }

      const user = await GithubUser.search(username);

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!");
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}
// A class FavoritesView extendendo tudo da class Favorites
export class FavoritesView extends Favorites {
  // root agora está recebendo o #app
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");

      this.add(value);
    };
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.creatRow();

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `Imagem de ${user.name}`;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories span").textContent = user.public_repos;
      row.querySelector(".followers span").textContent = user.followers;

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Deseja deletar esta linha?");

        if (isOk) {
          this.delete(user);
        } else {
        }
      };

      this.tbody.append(row);
    });
  }

  creatRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td class="user">
          <img src="https://github.com/luanrodriguespigosso.png" alt="Imagem de Luan Rodrigues Pigosso">
          <a href="https://github.com/luanrodriguespigosso/">
            <p>Luan Pigosso</p>
            <span>luanrodriguespigosso</span>
          </a>
        </td>
        <td class="repositories">
          <span>76</span>
        </td>
        <td class="followers">
          <span>21</span>
        </td>
        <td>
          <button class="remove">&times;</button> <!-- &times; represente o simbolo de x -->
        </td>
      `;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
