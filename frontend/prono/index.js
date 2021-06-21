function auth() {
    sessionStorage.setItem("user", document.getElementById("user-name").value)
    sessionStorage.setItem("pass", document.getElementById("pass").value)
    location.href='dashboard.html'
}
