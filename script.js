document.getElementById("entradaForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const dataNascimento = document.getElementById("dataNascimento").value;

  if (nome && dataNascimento) {
    // Salva no localStorage
    localStorage.setItem("nomeUsuario", nome);
    localStorage.setItem("dataNascimentoUsuario", dataNascimento);

    // Redireciona após pequeno delay
    setTimeout(() => {
      window.location.href = "https://images.app.goo.gl/VvLqSCgwx3VGaU2M7";
    }, 1000);
  } else {
    alert("Por favor, preencha todos os campos.");
  }
});
