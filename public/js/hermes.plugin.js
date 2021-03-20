!(function (a) {
    "use strict";
    var b = {
        getSessionId: function () {
            if (void 0 === Cookies.get("wdgt_sess_id")) {
                var a = "WDGT_" + uuidv4();
                Cookies.set("wdgt_sess_id", a, { expires: 1 });
            }
        },
        init: function (c) {
            var d,
                e,
                f = a.extend({ key: 1, title: "Hermes Chat", css: !1, visible: !0, log: !0, form: !1, object: "messageContainer" }, c);
            return (
                a.ajaxSetup({ xhrFields: { withCredentials: !0 } }),
                b.destroy(f.object),
                (d =
                    '<div id="' +
                    f.object +
                    '" class="hermes-container">\n <div class="hermes-header">\n  <span class="hermes-title">' +
                    f.title +
                    '</span>  <span class="close-btn"></span>  <span class="mini-btn"></span>  <div class="credits"><a href="http://soldai.com/" target="_blank">Powered by SoldAI</a></div> </div>\n <div class="hermes-body">   <div class="hermes-text"></div>\n   <div class="hermes-input-wrapper">     <textarea name="message" class="hermes-input" rows="1" placeholder="Escribe tus dudas"></textarea>\n   </div> </div></div>'),
                f.css || a("head").append('<link rel="stylesheet" type="text/css" href="https://soldai.com/api_files/v3-1/chat-widget.css" />'),
                a("body").append(d),
                f.visible
                    ? (a("#" + f.object).addClass("minimize"), a("#" + f.object + " .close-btn").remove())
                    : (a("#" + f.object).addClass("hide"),
                      a("#" + f.object + " .close-btn").click(function (b) {
                          b.preventDefault(), a.fn.hermes("toggleHide", f.object);
                      })),
                a("#" + f.object + " .hermes-header").on("click touchstart", function (b) {
                    a("#" + f.object).hasClass("minimize") && (b.stopPropagation(), a.fn.hermes("toggleExpand", f.object));
                }),
                a("#" + f.object + " .mini-btn").click(function (b) {
                    b.preventDefault(), b.stopPropagation(), a.fn.hermes("toggleExpand", f.object);
                }),
                a("#" + f.object + " .hermes-input").keydown(function (b) {
                    13 === b.keyCode && "" !== a(this).val().trim() && (b.preventDefault(), a.fn.hermes("send", f.object));
                }),
                this.each(function () {
                    a(this).click(function (b) {
                        b.preventDefault(),
                            a("#" + f.object).hasClass("minimize") || f.visible ? a.fn.hermes("toggleExpand", f.object) : a.fn.hermes("toggleHide", f.object);
                    });
                }),
                a("#" + f.object).data("settings", f),
                "undefined" != typeof Storage &&
                    sessionStorage.getItem(f.object + "_history") &&
                    ((e = sessionStorage.getItem(f.object + "_history")),
                    a("#" + f.object + " .hermes-text").html(e),
                    a("#" + f.object + " .hermes-text").scrollTop(a("#" + f.object + " .hermes-text").prop("scrollHeight"))),
                this
            );
        },
        toggleHide: function (b) {
            a("#" + b).removeClass("minimize"), a("#" + b).toggleClass("hide"), a.fn.hermes("hello", b);
        },
        toggleExpand: function (b) {
            a("#" + b).toggleClass("minimize"), a.fn.hermes("hello", b);
        },
        send: function (c) {
            var d = a("#" + c).data("settings"),
                e = "#" + c + " .hermes-input",
                f = "#" + c + " .hermes-text";
            a(e).prop("disabled", !0),
                b.getSessionId(),
                a
                    .get(
                        "http://beta.soldai.com/bill-cipher/askquestion",
                        { key: d.key, log: !0, session_id: Cookies.get("wdgt_sess_id"), num_intents: 1, question: a(e).val().trim() },
                        null,
                        "json"
                    )
                    .done(function (b) {
                        var d = 1e3 * b.delay;
                        a("<div>", { class: "messages user" }).text(a(e).val()).appendTo(f),
                            a("<div>", { class: "messages hermes" })
                                .html(b.current_response.message)
                                .delay(d)
                                .queue(function () {
                                    a(this).appendTo(f),
                                        a(f).scrollTop(a(f).prop("scrollHeight")),
                                        "undefined" != typeof Storage && sessionStorage.setItem(c + "_history", a(f).html());
                                }),
                            a(e).val("");
                    })
                    .fail(function () {
                        a("<div>", { class: "messages hermes" })
                            .text("OcurriÃ³ un error al enviar tu mensaje, por favor intenta de nuevo mÃ¡s tarde.")
                            .appendTo(f);
                    })
                    .always(function () {
                        a(f).scrollTop(a(f).prop("scrollHeight")), a(e).prop("disabled", !1).focus();
                    });
        },
        hello: function (b) {
            var c = "#" + b + " .hermes-text";
            "" == a(c).html() &&
                a("<div>", { class: "messages hermes" })
                    .text("¡Hola!, Soy un agente virtual encargado de dar respuesta a tus dudas, ¿Tienes alguna pregunta?")
                    .appendTo(c);
        },
        destroy: function (b) {
            "all" != b || a("#all").length ? a("#" + b).remove() : a(".hermes-container").remove();
        },
        validateInt: function (a) {
            if (isNaN(a)) return !1;
            var b = parseFloat(a);
            return (0 | b) === b;
        },
        validateNum: function (a) {
            return !Number.isNaN(parseFloat(a)) && Number.isFinite(a);
        }
    };
    a.fn.hermes = function (c) {
        return "object" != typeof c && c
            ? b[c]
                ? b[c].apply(this, Array.prototype.slice.call(arguments, 1))
                : void a.error("Method " + c + " does not exist on jQuery.hermes")
            : b.init.apply(this, arguments);
    };
})(jQuery);
