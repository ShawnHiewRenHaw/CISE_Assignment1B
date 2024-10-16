'use client'

import Image from 'next/image';
import formStyles from "../../styles/Form.module.scss";


function checkCredentials() {
  var username = (document.getElementById("username") as HTMLInputElement).value;
  var password = (document.getElementById("password") as HTMLInputElement).value;

  if (username != null && password != null) {
    if (username == "Admin" && password == "123456") {
      document.getElementById("admin")?.click();
    } else if (username == "Analyst" && password == "123456") {
      document.getElementById("analyst")?.click();
    } else if (username == "Moderator" && password == "123456") {
      document.getElementById("moderator")?.click();
    } else {
      (document.getElementById("errorMessage") as HTMLInputElement).innerHTML = "Wrong Credentials<br /><br />";
    }
  }
}

export default function Home() {
  return (
    <main id="main">
      <a href="/"><input type="button" className="button returnButton" value="Back" /></a>
      <h1 className="projectName">SPEED</h1><br />
      <br />
      <form className="block">
        <h2 className="blockTitle">Staff Login:</h2><br />
        <label className="inputLabel">Username: </label>
        <input required id="username" className="inputValue"></input><br /><br />
        <label className="inputLabel">Password: </label>
        <input required type="password" id="password" className="inputValue"></input><br /><br />
        <p id="errorMessage" />
        <input type='button' className="button" value="Login" onClick={checkCredentials}></input>
      </form>
      <div id="tempHiddenLinks" hidden>
        <a id="admin" href='././Admin'>Admin</a>
        <a id="analyst" href='././Analyst'>Analyst</a>
        <a id="moderator" href='../moderator'>Moderator</a>
      </div>
    </main>
  )
}
