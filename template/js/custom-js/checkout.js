$(function () {
    $html =
    "*Pedidos finalizados até as 15h são enviados no mesmo dia com prazo de entrega no dia útil seguinte.<br/>*Pedidos finalizados após as 15h serão enviados no dia seguinte, com prazo de entrega de 2 dias úteis da data da compra.";
    $cookieName = "TimCampaign";

  // =====================
  // Contador de tempo restante
  // =====================
    var now = new Date();
    var end = new Date();
    end.setHours(15,0,0,0);
    
    var $remaining = new Date(end - now);

    $hourConnector = $remaining.getHours() > 1 ? "nas próximas" : "na próxima";
    // =======================

    if (now.getHours() >= 15 && now.getMinutes() > 0) {
      let tomorrow = new Date()
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(15,0,0,0);
      $remaining = new Date(tomorrow - now);
      $string = ($remaining.getHours() + 3) +"h "+$remaining.getMinutes()+"min";
      $html = "Até 2 dia úteis<br class='imutable'><span>Se pedir dentro de <br><b class='green'>"+$string+"</b></span>";
    }else{
      $string = $hourConnector+"<br><b class='green'>"+ $remaining.getHours() +"h "+$remaining.getMinutes()+"min</b>";
      $html = "Até Amanhã<br class='imutable'><span>Se pedir "+$string+"</span>";
    }

  // =====================
  // Funções
  // =====================
  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  function eraseCookie(name) {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }
  function changeSedex() {

    function defaultReplace() {
      setTimeout(() => {
        if ($(".list-group").length > 0) {
          $(".list-group > a").each(function (index, element) {
            $list = $(this);
            $text = $list.find("small").text();
            if ($text == "SEDEX") {
              $list.find(".shipping-line>strong:first-child").html($html);
              $list.attr("sedex-tim", true);
            }
          });
        }
      }, 250);
    }
    if (window.location.href.indexOf("cart") > 0) {
      defaultReplace();
    } else {
      defaultReplace();
    }
  }
  function MutationSedex() {
    const elementToObserve = $(".shipping-calculator__services")[0];
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        changeSedex();
      });
    });
    observer.observe(elementToObserve, { childList: true,subtree : true });
  }
  
  // =====================
  // Execs
  // =====================
  // Pagina de carrinho
  if (window.location.href.indexOf("utm_campaign=tim") > 0 || getCookie($cookieName) != null) {
    setCookie($cookieName, "true", 1);
    if (window.location.href.indexOf("cart") > 0) {
      if ($(".shipping-calculator__services")[0] === undefined) {
        var checkExist = setInterval(function () {
          if ($(".shipping-calculator__services").length) {
            clearInterval(checkExist);
            MutationSedex();
          }
        }, 100);
      } else {
        MutationSedex();
      }
    }
  }
  // Pagina de Pagamento
  if (getCookie($cookieName) != null) {
    if (window.location.href.indexOf("checkout") > 0) {
      var checkExist = setInterval(function () {
        if ($(".shipping-calculator__services .list-group").length > 0) {
          setTimeout(() => {
            var checkExist2 = setInterval(function () {
                if ($(".shipping-calculator__services .list-group").length > 0) {
                    const elementToObserve = $(".checkout__col.col-md-6:first-child")[0];
                    const observer = new MutationObserver(function (mutations) {
                      mutations.forEach(function (mutation) {
                        changeSedex();
                      });
                    });
                    observer.observe(elementToObserve, { childList: true,subtree : true });
                    clearInterval(checkExist2);
                }
            });
          }, 2000);

          clearInterval(checkExist);
        }
      }, 100);
    }
  }

  // Limpa o cookie quando confirma o pedido
  if (window.location.href.indexOf("/confirmation/") > 0){
    eraseCookie($cookieName)
  }
});

