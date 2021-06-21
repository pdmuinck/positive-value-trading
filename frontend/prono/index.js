setInterval(
    function() {
        if(document.getElementById("error")) {
            document.getElementById("error").innerHTML = ""
        }
        if(document.getElementById("error-submit")) {
            document.getElementById("error-submit").innerHTML = ""
        }
    },
    10000
)

function auth() {
    sessionStorage.setItem("user", document.getElementById("user-name").value)
    sessionStorage.setItem("pass", document.getElementById("pass").value)
    location.href='dashboard.html'
}
