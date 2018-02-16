defmodule ChienWeb.UserController do
    use ChienWeb, :controller
    alias Chien.User
    alias Chien.Repo

    def index(conn, _params) do
      users = Repo.all(User)
      render(conn, "index.html", users: users)
    end

    def show(conn, %{"id" => id}) do
      user = Repo.get!(User, id)
      render(conn, "show.html", user: user)
    end

end