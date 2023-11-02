$(document).ready(function() {
    console.log('jQuery is running');
    cardapio.events.init();

});

var cardapio = {};

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
    }

}

cardapio.templates = {
    item: `                        
        <div class="col-3 mb-5">
            <div class="card card-item">
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
                    <span class="btn-decrement"><i class="fas fa-minus"></i></span>
                    <span class="add-number-items">0</span>
                    <span class="btn-increment"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add"><i class="fa fa-shopping-cart"></i></span>
                </div>
            </div>
        </div>`
}
