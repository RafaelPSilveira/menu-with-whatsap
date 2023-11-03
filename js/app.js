$(document).ready(function() {
    console.log('jQuery is running');
    cardapio.events.init();

});

var cardapio = {};
var my_cart = [];

cardapio.events = {
    init: () => {
        cardapio.methods.getItemsMenu();
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
        }else{
            $("#modalCart").addClass("hidden");
        }
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
        <div class="col-3 mb-5">
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
        </div>`
    }
