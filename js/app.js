$(document).ready(function() {
    console.log('jQuery is running');
    cardapio.events.init();

});

var cardapio = {};
var my_cart = [];
var value_cart = 0;
var value_delivery = 5;
var address = null;
var number_phone = '5548988406937';
let Instagram = "https://www.instagram.com/";
let Facebook = "https://www.facebook.com/";


cardapio.events = {
    init: () => {
        cardapio.methods.getItemsMenu();
        cardapio.methods.makeReservation();
        cardapio.methods.phoneNumber();
        cardapio.methods.loadSocialMedias();
    }
}

cardapio.methods = {

    //* Get all items from menu
    getItemsMenu: (category = 'burgers', viewMore = false) => {

        var filter = MENU[category];

        //* Clear items 
        if (!viewMore){
            $("#itemsCardapio").html("");
            $("#btnViewMore").removeClass("hidden");
        }

        $.each(filter, (i, e) =>{
            let template = cardapio.templates.item
                .replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${id}/g, e.id)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','));

            //* Btn view more - show 4 items
            if (viewMore && i >= 8 && i <= 12){
                $("#itemsCardapio").append(template);
            }

            //* Initial paginate
            if (!viewMore && i < 8){
                $("#itemsCardapio").append(template);
            }
        })
        //* Remove active class
        $(".container-menu a").removeClass("active");

        //* Add active class
        $("#menu-" + category).addClass("active");

    },

    //* click in btn view more
    viewMore: () => {
        var active = $(".container-menu a.active").attr("id").split('menu-')[1];

        cardapio.methods.getItemsMenu(active, true);

        $("#btnViewMore").addClass("hidden");
    },

    //* Decrement item in cart
    decrementItem : (id) => {
        let qtdCurrent = parseInt($("#qtd-" + id).text());

        if (qtdCurrent > 0){
            $("#qtd-" + id).text(qtdCurrent - 1);
        }
    },

    incrementItem : (id) => {
        let qtdCurrent = parseInt($("#qtd-" + id).text());
        $("#qtd-" + id).text(qtdCurrent + 1);
    },

    //* Add item in cart
    addItemCart: (id) => {
        let qtdCurrent = parseInt($("#qtd-" + id).text());
    
            if (qtdCurrent > 0) {
                let category = $(".container-menu a.active").attr("id").split('menu-')[1];
                let item = MENU[category].find(x => x.id === id);
        
                //* Checks if the item already exists in the cart
                let existingItem = my_cart.find(cartItem => cartItem.id === id);
        
                if (existingItem) {
                    existingItem.qtd += qtdCurrent;
                    cardapio.methods.message('Quantidade do item alterada', 'success');

                } else {
                    item.qtd = qtdCurrent;
                    my_cart.push(item);
                    cardapio.methods.message('Item adicionado ao carrinho !!!', 'success');
                }
            } else {
                cardapio.methods.message('Por favor selecione a quantidade !!!', 'warning');
            }
            $("#qtd-" + id).text(0);

            cardapio.methods.updateBadgeTotal();
    }, 
    
    //* Update badge total items in cart
    updateBadgeTotal: () => {
        let total = 0;
        $.each(my_cart, (i, e) => {
            total += e.qtd;
        });

        if (total > 0){
            $(".btn-cart").removeClass("hidden");
            $(".container-total-cart").removeClass("hidden");
        }else{
            $(".btn-cart").addClass("hidden");
            $(".container-total-cart").addClass("hidden");
        }

        $(".badge-total-cart").html(total);
    },

    //* Open modal cart
    openCart: (open) => {
        if (open){
            $("#modalCart").removeClass("hidden");
            cardapio.methods.listItemsCart();
        }else{
            $("#modalCart").addClass("hidden");
        }
    },

    //* change items according to stage
    changeStage: (stage) => {

        if(stage === 1){
            $('#lblTitlePhase').text('Meu carrinho: ');
            $('#itemsCart').removeClass('hidden');
            $('#deliveryAddress').addClass('hidden');
            $('#summaryCart').addClass('hidden');

            $('.phase').removeClass('active');
            $('.phase-1').addClass('active');

            $('#phaseOrder').removeClass('hidden');
            $('#phaseAddress').addClass('hidden');
            $('#sendRequest').addClass('hidden');
            $('#btnBack').addClass('hidden');
        }

        if(stage === 2){
            $('#lblTitlePhase').text('Endereço de Entrega: ');
            $('#itemsCart').addClass('hidden');
            $('#deliveryAddress').removeClass('hidden');
            $('#summaryCart').addClass('hidden');

            $('.phase').removeClass('active');
            $('.phase-1').addClass('active');
            $('.phase-2').addClass('active');

            $('#phaseOrder').addClass('hidden');
            $('#phaseAddress').removeClass('hidden');
            $('#sendRequest').addClass('hidden');
            $('#btnBack').removeClass('hidden');
        }

        if(stage === 3){
            $('#lblTitlePhase').text('Resumo do pedido: ');
            $('#itemsCart').addClass('hidden');
            $('#deliveryAddress').addClass('hidden');
            $('#summaryCart').removeClass('hidden');

            $('.phase').removeClass('active');
            $('.phase-1').addClass('active');
            $('.phase-2').addClass('active');
            $('.phase-3').addClass('active');

            $('#phaseOrder').addClass('hidden');
            $('#phaseAddress').addClass('hidden');
            $('#sendRequest').removeClass('hidden');
            $('#btnBack').removeClass('hidden');
        }
    },

    //* Return to previous stage
    backStage: () => {
        let stage = $('.phase.active').length;
        cardapio.methods.changeStage(stage - 1);
    },

    //* List items in cart
    listItemsCart: () => {
        cardapio.methods.changeStage(1);

        if(my_cart.length > 0){
            $("#itemsCart").html("");
            $.each(my_cart, (i, e) => {
                let template = cardapio.templates.itemCart
                    .replace(/\${img}/g, e.img)
                    .replace(/\${name}/g, e.name)
                    .replace(/\${id}/g, e.id)
                    .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                    .replace(/\${qtd}/g, e.qtd);

                $("#itemsCart").append(template);

                //* last item
                if((i + 1) == my_cart.length){
                    cardapio.methods.updateValuesCart();
                }
                
            });
        }else {
            $("#itemsCart").html('<p class="text-center cart-empty"><i class="fa fa-shopping-cart"></i> Nenhum item adicionado ao carrinho</p>');
            cardapio.methods.updateValuesCart();
        };
    },

    //* Decrement item in cart
    decrementItemCart : (id) => {
        let qtdCurrent = parseInt($("#qtd-cart-" + id).text());

        if (qtdCurrent > 1){
            $("#qtd-cart-" + id).text(qtdCurrent - 1);
            cardapio.methods.updateItemsCart(id, qtdCurrent - 1);
        } else {
            cardapio.methods.removeItemCart(id);
        }
    },

    //* Increment item in cart
    incrementItemCart : (id) => {
        let qtdCurrent = parseInt($("#qtd-cart-" + id).text());
        $("#qtd-cart-" + id).text(qtdCurrent + 1);
        cardapio.methods.updateItemsCart(id, qtdCurrent + 1);
    },

    //* Remove item in cart
    removeItemCart : (id) => {
        my_cart = $.grep(my_cart, (e , i) => { return e.id != id; });
        cardapio.methods.listItemsCart();

        //* update badge total
        cardapio.methods.updateBadgeTotal();
    },

    //* Update items cart
    updateItemsCart: (id, qtd) => {
        let objIndex = my_cart.findIndex((obj => obj.id == id));
        my_cart[objIndex].qtd = qtd;

        //* update badge total
        cardapio.methods.updateBadgeTotal();

        //* update values subtotal, delivery and total
        cardapio.methods.updateValuesCart();
    },

    //* update values subtotal, delivery and total
    updateValuesCart: () => {
        value_cart = 0;

        $('#lblSubTotal').text('R$ 0,00');
        $('#lblValueDelivery').text('+ R$ 0,00');
        $('#lblTotal').text('R$ 0,00');

            $.each(my_cart, (i, e) => {
                value_cart += parseFloat(e.qtd * e.price);
                
                if((i + 1) == my_cart.length){
                    $('#lblSubTotal').text('R$ ' + value_cart.toFixed(2).replace('.', ','));
                    // if(value_cart >= 500){
                    //     value_delivery = 0;
                    // } else {
                    //     $('#lblValueDelivery').text('+ R$ ' + value_delivery.toFixed(2).replace('.', ','));
                    // }
                    $('#lblValueDelivery').text('+ R$ ' + value_delivery.toFixed(2).replace('.', ','));
                    $('#lblTotal').text('R$ ' + (value_cart + value_delivery).toFixed(2).replace('.', ','));
                }
            });
    },

    //* Load phase address
    loadPhaseAddress: () => {
        if (my_cart.length <= 0){
            cardapio.methods.message('Por favor adicione itens ao carrinho !!!', 'warning');
            return;
        } else {
            cardapio.methods.changeStage(2);
        }
    },

    //* Search zip code
    searchZipCode: () => {
        let zipCode = $('#zipCode').val().trim().replace(/\D/g, '');

        if (zipCode.length =! ""){

            var validadeZipCode = /^[0-9]{8}$/;

            if(validadeZipCode.test(zipCode)){
                
                $.getJSON('https://viacep.com.br/ws/' + zipCode + '/json/?callback=?', function(data){
                    if(!("erro" in data)){
                        $('#address').val(data.logradouro);
                        $('#district').val(data.bairro);
                        $('#city').val(data.localidade);
                        $('#uf').val(data.uf);
                        $('#number').focus();
                    } else {
                        cardapio.methods.message('CEP não encontrado !!! Preencha manualmente.', 'warning');
                        $('#address').focus();
                    }
                });

            } else {
                cardapio.methods.message('CEP inválido !!!', 'warning');
                $('#zipCode').focus();
            }

        } else {
            cardapio.methods.message('Por favor informe o CEP !!!', 'warning');
            $('#zipCode').focus();
        }
    },

    //* Order summary
    orderSummary: () => {
        
        let zipCode = $('#zipCode').val().trim();
        let addressCli = $('#address').val().trim();
        let number = $('#number').val().trim();
        let district = $('#district').val().trim();
        let city = $('#city').val().trim();
        let uf = $('#uf').val().trim();
        let complement = $('#complement').val().trim();

        if (zipCode <= 0){
            cardapio.methods.message('Por favor informe o CEP !!!', 'warning');
            $('#zipCode').focus();
            return;
        }
        if (addressCli <= 0){
            cardapio.methods.message('Por favor informe o endereço !!!', 'warning');
            $('#address').focus();
            return;
        }
        if (number <= 0){
            cardapio.methods.message('Por favor informe o número !!!', 'warning');
            $('#number').focus();
            return;
        }
        if (district <= 0){
            cardapio.methods.message('Por favor informe o bairro !!!', 'warning');
            $('#district').focus();
            return;
        }
        if (city <= 0){
            cardapio.methods.message('Por favor informe a cidade !!!', 'warning');
            $('#city').focus();
            return;
        }
        if (uf == "-1"){
            cardapio.methods.message('Por favor informe o estado !!!', 'warning');
            $('#uf').focus();
            return;
        }

        address = {
            zipCode: zipCode,
            address: addressCli,
            number: number,
            district: district,
            city: city,
            uf: uf,
            complement: complement
        }

        cardapio.methods.changeStage(3);
        cardapio.methods.confirmOrder();

    },

    //* Confirm order
    confirmOrder: () => {

        $('#listItemsSummary').html("");

        $.each(my_cart, (i, e) => {
            let template = cardapio.templates.itemSummary
                .replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${qtd}/g, e.qtd);

            $("#listItemsSummary").append(template);
        });

        $('#summaryAddress').html(`${address.address}, ${address.number}, ${address.district}`);
        $('#cityAddress').html(`${address.city} - ${address.uf} / ${address.zipCode} ${address.complement}`);

        cardapio.methods.endOrder();

    },

    //* End order
    endOrder: () => {
        if (my_cart.length > 0 && address != null) {
            var itemsOrder = ''; // Mova a declaração de itemsOrder para fora do loop
    
            $.each(my_cart, (i, e) => {
                itemsOrder += `${e.qtd}x - ${e.name} ....... R$ ${(e.price).toFixed(2).replace('.', ',')}\n`;
    
                if ((i + 1) === my_cart.length) {
                    var textMsg = `Olá, gostaria de fazer o pedido:\n*Itens do Pedido:*\n\n${itemsOrder}`;
                    textMsg += '\n*Endereço de entrega:';
                    textMsg += `\n${address.address}, ${address.number}, ${address.district}`;
                    textMsg += `\n${address.city} - ${address.uf} / ${address.zipCode} ${address.complement}`;
                    textMsg += `\n\n*Total (com entrega): R$ ${(value_cart + value_delivery).toFixed(2).replace('.', ',')}*\n`;
    
                    let encodedMsg = encodeURIComponent(textMsg);
                    let url = `https://wa.me/${number_phone}?text=${encodedMsg}`;
                    $('#sendRequest').attr('href', url);
                    console.log(textMsg);
                }
            });
        }
    },

    //* Button with link to request reservations
    makeReservation: () => {
        var textMsg = `Olá, gostaria de fazer uma *reserva*!`;
        let encodedMsg = encodeURIComponent(textMsg);
        let url = `https://wa.me/${number_phone}?text=${encodedMsg}`;

        $('#btnReservation').attr('href', url);
    },

    phoneNumber: () => {
        let url = `tel:${number_phone}`;
        $('#phoneCall').attr('href', url);
    },

    //* Load testimony
    loadTestimony: (testimony) => {
        $('#testimony-1').addClass('hidden');
        $('#testimony-2').addClass('hidden');
        $('#testimony-3').addClass('hidden');

        $('#btnTestimony-1').removeClass('active');
        $('#btnTestimony-2').removeClass('active');
        $('#btnTestimony-3').removeClass('active');

        $('#testimony-' + testimony).removeClass('hidden');
        $('#btnTestimony-' + testimony).addClass('active');
    },

    //* Load links social medias
    loadSocialMedias: () => {
        let urlInstagram = `https://www.instagram.com/`;
        let urlFacebook = `https://www.facebook.com/`;

        $('.linkInstagram').attr('href', urlInstagram);
        $('.linkFacebook').attr('href', urlFacebook);

        var textMsg = `Olá, vim do site e gostaria de fazer um pedido.`;
        let encodedMsg = encodeURIComponent(textMsg);
        let urlWhatsapp = `https://wa.me/${number_phone}?text=${encodedMsg}`;

        $('.linkWhatsapp').attr('href', urlWhatsapp);
    },

    message: (msg, color = 'danger', time = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();
        
        let text_msg = `<div id="msg-${id}" class="toast ${color} animated fadeInDown">${msg}</div>`;

        $("#container-msg").append(text_msg);

        setTimeout(() => {
            $("#msg-" + id).remove('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');

            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800);
        }, time);
    },


}

cardapio.templates = {
    item: `                        
        <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-5 wow fadeInUp">
            <div class="card card-item" id="\${id}">
                <div class="img-product">
                    <img src="\${img}" alt="">
                </div>
                <p class="title-product text-center mt-4">
                    <b>\${name}</b>
                </p>
                <p class="price-product text-center">
                    <b>R$ \${price}</b>
                </p>
                <div class="add-cart">
                    <span class="btn-decrement" onclick="cardapio.methods.decrementItem('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-number-items" id="qtd-\${id}">0</span>
                    <span class="btn-increment" onclick="cardapio.methods.incrementItem('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="cardapio.methods.addItemCart('\${id}')"><i class="fa fa-shopping-cart"></i></span>
                </div>
            </div>
        </div>`,

    itemCart: `                    
        <div class="col-12 items-cart" id="\${id}">
            <div class="img-product">
                <img src="\${img}" alt="">
            </div>
            <div class="data-product">
                <p class="title-product"><b>\${name}</b></p>
                <p class="price-product"><b>R$ \${price}</b></p>
            </div>
            <div class="add-cart">
                <span class="btn-decrement" onclick="cardapio.methods.decrementItemCart('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-number-items" id="qtd-cart-\${id}">\${qtd}</span>
                <span class="btn-increment" onclick="cardapio.methods.incrementItemCart('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove no-mobile" onclick="cardapio.methods.removeItemCart('\${id}')"><i class="fa fa-times"></i></span>
            </div>
        </div>`,
        itemSummary:
            `<div class="col-12 items-cart summary">
                <div class="img-product-summary">
                    <img src="\${img}" alt="">
                </div>
                <div class="data-product">
                    <p class="title-product-summary">
                        <b>\${name}</b>
                    </p>
                    <p class="price-product-summary">
                        <b>R$ \${price}</b>
                    </p>
                </div>
                <p class="qtd-product-summary">
                    x <b>\${qtd}</b>
                </p>
            </div>`
        
}

