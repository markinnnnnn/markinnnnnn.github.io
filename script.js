document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const dob = document.getElementById('dob').value;

  if (email && dob) {
    window.location.href = 'portfolio.html';
  } else {
    document.getElementById('error-message').textContent = 'Preencha todos os campos corretamente.';
  }
});
