function onSignIn(googleUser) {
  const idToken = googleUser.getAuthResponse().id_token

  const xhr = new XMLHttpRequest()

  xhr.open('POST', '/google')
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.onload = function () {
    console.log(`Signed in as: ${xhr.responseText}`)
  }
  xhr.send(`idToken=${idToken}`)
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance()
  auth2.signOut().then(function () {
    console.log('User signed out.')
  })
}
