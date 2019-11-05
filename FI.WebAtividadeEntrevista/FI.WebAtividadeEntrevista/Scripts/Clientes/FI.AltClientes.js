var beneficiarios = [];
var beneficiariosLista = [];

function deletarBeneficiario(id) {
    for (beneficiario in beneficiarios) {
        if (beneficiarios[beneficiario].id == id) {
            beneficiarios.splice(beneficiario, 1);
            $("#ben" + id).remove();
        }
    }
}

var alterarFunc = false;
var beneficiarioToDelete = 0;

function alterarBeneficiario(id) {
    for (beneficiario in beneficiarios) {
        if (beneficiarios[beneficiario].id == id) {
            $('#ModalCPF').val(beneficiarios[beneficiario].cpf);
            $('#ModalNome').val(beneficiarios[beneficiario].nome);
            $('#cadastroBeneficiario').text('Alterar');
            alterarFunc = true;
            beneficiarioToDelete = id;
        }
    }

}
$(document).ready(function () {
    // inicialização mascara cpf
    $('.cpf').mask('000.000.000-00');


    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #CPF').val(obj.CPF);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        beneficiariosLista = obj.Beneficiarios;
    }

    //Populando Tabela de beneficiarios
    for (ben of beneficiariosLista) {
        beneficiarios.push({ id: ben.Id, nome: ben.Nome, cpf: ben.CPF });
    };

    var newRows = "";
    for (var i = 0; i < beneficiarios.length; i++) {
        newRows += '<tr id="ben' + beneficiarios[i].id + '"><td>' + beneficiarios[i].cpf +
            "</td><td>" + beneficiarios[i].nome + '</td><td><button id="#alterar' + beneficiarios[i].id + '"style="' + 'margin-right:2px;"' + 'class="' + 'btn btn-sm btn-primary"' + 'onclick="' + 'alterarBeneficiario(' + beneficiarios[i].id + ' )"' + '>Alterar</button>' + '<button id="#deletar' + beneficiarios[i].id + '"class="' + 'btn btn-sm btn-primary"' + 'onclick="' + 'deletarBeneficiario(' + beneficiarios[i].id + ' )"' + '>Deletar</button>' + '</td></tr>';
    }
    $("table tr:first").after(newRows);

    $('#formCadastro').submit(function (e) {
        //Remoção de Caracteres Especiais provenientes do uso de mascaras
        var beneficiariosParse = [];
        for (beneficiario of beneficiarios) {
            var parsed = beneficiario;
            parsed.cpf = parsed.cpf.replace(/\D/g, "");
            beneficiariosParse.push(parsed);
        }
        e.preventDefault();

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "CPF": $(this).find("#CPF").val().replace(/\D/g, ""),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "Beneficiarios": beneficiariosParse
            },
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    ModalDialog("Sucesso!", r)
                    $("#formCadastro")[0].reset();
                    window.location.href = urlRetorno;
                }
        });
    });

        var id = beneficiarios.length > 0 ? beneficiarios[beneficiarios.length - 1].id + 1 : 0;
        var bk = false;
        $('#cadastroBeneficiario').click(function () {
            // Validação se a função foi chamada para alterar ou adicionar um beneficiario
            debugger;
            if (alterarFunc) {
                deletarBeneficiario(beneficiarioToDelete);
            }

            var cpf = $('#ModalCPF').val();
            var nome = $('#ModalNome').val();
            //Validação de CPF do beneficiario a ser adicionado
            for (element of beneficiarios) {
                if (cpf == element.cpf) {
                    alert("CPF já existente");
                    bk = true;

                }
            }

            if (!bk) {
                $("table td").remove();

                var beneficiario = {
                    id: id,
                    cpf: cpf,
                    nome: nome
                }

                id++;
                // Criação da Tabela  de Beneficiarios
                beneficiarios.push(beneficiario);
                var newRows = "";
                for (var i = 0; i < beneficiarios.length; i++) {
                    newRows += '<tr id="ben' + beneficiarios[i].id + '"><td>' + beneficiarios[i].cpf +
                        "</td><td>" + beneficiarios[i].nome + '</td><td><button id="#alterar' + beneficiarios[i].id + '"style="' + 'margin-right:2px;"' + 'class="' + 'btn btn-sm btn-primary"' + 'onclick="' + 'alterarBeneficiario(' + beneficiarios[i].id + ' )"' + '>Alterar</button>' + '<button id="#deletar' + beneficiarios[i].id + '"class="' + 'btn btn-sm btn-primary"' + 'onclick="' + 'deletarBeneficiario(' + beneficiarios[i].id + ' )"' + '>Deletar</button>' + '</td></tr>';
                }
                $("table tr:first").after(newRows);

                var cpf = $('#ModalCPF').val("");
                var nome = $('#ModalNome').val("");
                alterarFunc = false;
                $('#cadastroBeneficiario').text('Salvar');
            }
            bk = false;
        });
    
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
