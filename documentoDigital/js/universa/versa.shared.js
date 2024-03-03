var VersaShared = VersaShared || function () {
    this.validations = this.validations || [];
    this.steps = this.steps || {};
    this.defaults = this.defaults || {};
    this.options = this.options || this.defaults || {};
    var __versaShared = this;

    /**
     * Cria um identificador exclusivo (GUID)
     * @returns {string}
     */
    this.createGUID = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };

    /**
     * Verificar se uma determinada posição de um objeto ou um array é uma função,
     * caso positivo retorna a função, caso negativo retorna falso
     * @param container {Object|Array}
     * @param position {string}
     * @returns {function|bool}
     */
    this.getFunction = function (container, position) {
        container = container || window;
        position = position || false;

        if (this.isFunction(container, position)) {
            return container[position];
        }

        return false;
    };

    /**
     * Verificar se uma determinada posição de um objeto ou um array é uma função,
     * caso positivo retorna true, caso negativo retorna falso
     * @param container {Object|Array}
     * @param position {string}
     * @returns {bool}
     */
    this.isFunction = function (container, position) {
        container = container || window;
        position = position || false;

        if (position && container[position] && typeof container[position] == 'function') {
            return true;
        }

        return false;
    };

    this.setDefaultsValidator = function () {
        if ($['validator']) {
            $.validator.setDefaults({
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                errorElement: 'span',
                errorClass: 'help-block',
                errorPlacement: function (error, element) {
                    if (element.parent('.input-group').length) {
                        error.insertAfter(element.parent());
                    } else if (element.parent('label').length) {
                        error.insertAfter(element.parent());
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
        }
    };

    this.setDefaults = function (opts, defaults) {
        defaults = defaults || this.defaults || [];
        opts = opts || [];

        this.options = $.extend(true, defaults, opts);

        __versaShared.setDefaultsValidator();

        if ($['browser'] && $['browser']['webkit']) {
            $("input[type!=password][autocomplete=off]").prop("type", "search");
        }

        if ($['datetimepicker']) {
            $.datetimepicker.setLocale('pt-BR');
        }

        if ($['fn'] && $['fn']['dataTable']) {
            $.fn.dataTable.ext.errMode = 'none';
        }

        if (this.options.formElement) {
            var optsValidate = {ignore: '.ignore'};

            if (this.isFunction(this, 'submitHandler')) {
                optsValidate['submitHandler'] = this.submitHandler;
            }

            this.options.validator = $(this.options.formElement).validate(optsValidate);
        }

        $('.close-modal, .modal-header>.close').each(function (i, item) {
            var $item = $(item);

            if (!$item.data('clickmodal')) {
                $item.click(function () {
                    $($(this).closest('.modal')).modal('hide');
                });
                $item.data('clickmodal', true);
            }
        });

        //Leitora de código de barras
        $(document).on('keydown', '.select2-input, .ui-autocomplete-input, .form-control', function (e) {
            if (e.ctrlKey && (e.which == 74)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });

        if ($['store'] && !$['storage']) {
            $.storage = new $.store();
        }
    };

    this.numPad = function (n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    };

    this.showNotificacao = function (param) {
        var options = $.extend(
            true,
            {content: '', title: '', type: 'info', icon: '', color: '', timeout: false},
            param
        );

        switch (options.type) {
            case 'danger':
                options.icon = 'fa-times-circle';
                options.title = options.title || 'Atenção:';
                options.color = '#a90329';
                break;
            case 'info':
                options.icon = 'fa-info-circle';
                options.title = options.title || 'Informação:';
                options.color = '#57889c';
                break;
            case 'success':
                options.icon = 'fa-check-circle';
                options.title = options.title || 'Sucesso:';
                options.color = '#739e73';
                break;
            case 'warning':
                options.icon = 'fa-exclamation-circle';
                options.title = options.title || 'Atenção:';
                options.color = '#c79121';
                break;
        }

        var optionsNotification = {
            title: options.title,
            content: "<i>" + options.content + "</i>",
            color: options.color,
            icon: "fa " + options.icon
        };

        if (options.timeout) {
            optionsNotification.timeout = options.timeout;
        }

        if ($['smallBox'] && !__versaShared.options['useToaster']) {
            $.smallBox(optionsNotification);
        } else if ($['toaster']) {
            if (optionsNotification['title'][optionsNotification['title'].length - 1] == ':') {
                optionsNotification['title'] = optionsNotification['title'].substring(
                    0,
                    optionsNotification['title'].length - 1
                );
            }

            optionsNotification['message'] = '<br>' + optionsNotification['content'];
            optionsNotification['priority'] = options.type;

            if (optionsNotification['timeout']) {
                $.toaster({settings: {timeout: optionsNotification['timeout'] / 5}});
            }


            $.toaster(optionsNotification);
        } else {
            var mensagem = optionsNotification.title + '<br>' + optionsNotification.content;
            mensagem = mensagem.replace(/<br(\s|)(\/|)>/img, "\n");
            mensagem = $('<p/>').html(mensagem).text();
            alert(mensagem);
        }

    };

    this.showNotificacaoFN = function (content, title, timeout, type) {
        content = content || '';
        title = title || '';
        timeout = timeout || 20000;

        if (!content) {
            return;
        }

        this.showNotificacao({
            content: content, type: type, title: title, timeout: timeout
        });
    };

    this.showNotificacaoInfo = function (content, title, timeout) {
        this.showNotificacaoFN(content, title, timeout, 'info');
    };

    this.showNotificacaoSuccess = function (content, title, timeout) {
        this.showNotificacaoFN(content, title, timeout, 'success');
    };

    this.showNotificacaoDanger = function (content, title, timeout) {
        this.showNotificacaoFN(content, title, timeout, 'danger');
    };

    this.showNotificacaoWarning = function (content, title, timeout) {
        this.showNotificacaoFN(content, title, timeout, 'warning');
    };

    this.addOverlay = function (el, mensagem) {
        mensagem = mensagem || 'Aguarde...';
        el.append('<div class="app-overlay">' + mensagem + '</div>');
    };

    this.removeOverlay = function (el) {
        el.find('.app-overlay').remove();
    };

    this.removeErroComponente = function (elemento) {
        if (elemento.find('>.component-item').length > 0) {
            elemento.find('>.component-item').removeClass('bg-danger');
            elemento.find('>.component-item .form-group .help-block').remove();
        } else {
            elemento.removeClass('bg-danger');
        }
    };

    this.adicionaErroComponente = function (elemento) {
        var $card = null;

        if (elemento.find('>.component-item').length > 0) {
            $card = elemento.find('>.component-item');
            $card.addClass('bg-danger');
        } else {
            $card = elemento;
            $card.addClass('bg-danger');
        }
    };

    this.setValidations = function () {
        $(document).on("change", ".form-control:hidden", function () {
            $(__versaShared.options.formElement).valid();
        });

        $(__versaShared.options.formElement).submit(function (e) {
            var ok = __versaShared.validate();

            if (!ok) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });
    };

    this.validate = function () {
        var navigation = $(this.options.wizardElement).find('ul:first');
        var nitens = navigation.find('li').length || Object.keys(__versaShared.steps).length;
        var keys = Object.keys(this.steps);

        var $form = $(__versaShared.options.formElement);
        $form.data('noSubmit', true);

        for (var i = 0; i < nitens; i++) {
            if (__versaShared.isFunction(__versaShared.steps[keys[i]] || [], 'validate')) {
                var err = __versaShared.steps[keys[i]].validate();

                if (err) {
                    navigation.find("li a").eq(i).trigger('click');

                    return false;
                }
            }
        }

        $form.data('noSubmit', false);

        return true;
    };

    this.loadSteps = function (begin, end) {
        var keys = Object.keys(this.steps);

        for (var i = 0; i < keys.length; i++) {
            if (this.isFunction(this.steps[keys[i]] || [], 'init')) {
                this.steps[keys[i]].init();
            }
        }
    };

    this.wizard = function () {
        /*
         * Para ocultar o botão de submit do form wizard e só exibir na última aba
         * Basta adicionar o atributo: data-wizard-action="submit" no botão de submit do formulário
         */
        var showButtonSubmit = function (indexAbaDestino, objNavegacao) {
            indexAbaDestino = __versaShared.retornarApenasNumero(indexAbaDestino) || 0;

            $("button[data-wizard-action='submit']").hide();

            var numeroAbas = objNavegacao.find('li').length - 1;
            if (indexAbaDestino >= numeroAbas) {
                $("button[data-wizard-action='submit']").show();
            }
        };

        var handleTabShow = function (tab, navigation, index, wizard) {

            var total = navigation.find('li').length;
            var current = index + 0;
            var percent = (current / (total - 1)) * 100;
            var percentWidth = 100 - (100 / total) + '%';

            navigation.find('li').removeClass('done');
            navigation.find('li.active').prevAll().addClass('done');

            wizard.find('.progress-bar').css({width: percent + '%'});
            $(__versaShared.options.wizardElement)
                .find('.form-wizard-horizontal')
                .find('.progress')
                .css({'width': percentWidth});

            showButtonSubmit(index, navigation);
        };

        var itens = $(__versaShared.options.wizardElement).find('.form-wizard li');

        //testa se é material admin
        if ($('.menubar-hoverable').length == 0) {
            itens.css('width', (100 / itens.length) + '%');
        }

        $(__versaShared.options.wizardElement).find('.progress').css({
            'width': ((100 / itens.length) * (itens.length - 1) * 0.99) + '%',
            'margin': '0 ' + ((100 / itens.length) / 2) + '%'
        });

        $(__versaShared.options.wizardElement).bootstrapWizard({
            tabClass: '',
            onTabShow: function (tab, navigation, index) {
                //Validar se terá alguma validação ao mudar e step no formulário e se for o step da validação configurada
                if (__versaShared.options.verificarEntrarStepWizard !== undefined && __versaShared.options.verificarEntrarStepWizard[index] !== undefined) {
                    //Verificar se já foi validado
                    if (!__versaShared.options.verificarEntrarStepWizard[index]['valido'] &&
                        //Verificar alguma condição passada que possa impedir essa validação
                        (__versaShared.options.verificarEntrarStepWizard[index]['condicao'] === undefined || __versaShared.options.verificarEntrarStepWizard[index]['condicao']())) {
                        $.SmartMessageBox({
                            title: "Atenção:",
                            content: __versaShared.options.verificarEntrarStepWizard[index]['mensagem'],
                            buttons: "[Não][Sim]",
                        }, function (ButtonPress) {
                            if (ButtonPress == "Sim") {
                                __versaShared.options.verificarEntrarStepWizard[index]['valido'] = true;

                                handleTabShow(tab, navigation, index, $(__versaShared.options.wizardElement));

                                //Caso precise executar alguma função após a confirmação de mudança de step do formulário
                                if (__versaShared.options.verificarEntrarStepWizard[index]['funcao']) {
                                    setTimeout(function() {
                                        __versaShared.options.verificarEntrarStepWizard[index]['funcao']();
                                    }, 500);
                                }
                            }
                            else if (index > 0) {
                                $(__versaShared.options.wizardElement).bootstrapWizard('show', (index - 1));
                                showButtonSubmit((index - 1), navigation);
                            }
                        });

                        return false;
                    }

                    //Caso precise executar alguma função após a confirmação de mudança de step do formulário
                    if (__versaShared.options.verificarEntrarStepWizard[index]['funcao']) {
                        setTimeout(function() {
                            __versaShared.options.verificarEntrarStepWizard[index]['funcao']();
                        }, 500);
                    }
                }

                handleTabShow(tab, navigation, index, $(__versaShared.options.wizardElement));
            },
            onTabClick: function (objAbaAtiva, objNavegacao, indexAbaAtiva, indexAbaDestino) {
                var numeroAbas = objNavegacao.find('li').length - 1;
                if (indexAbaDestino >= numeroAbas) {
                    indexAbaDestino = numeroAbas;
                }

                if (indexAbaAtiva < indexAbaDestino) {
                    var keys = Object.keys(__versaShared.steps);

                    for (var i = indexAbaAtiva; i < indexAbaDestino; i++) {
                        if (__versaShared.isFunction(__versaShared.steps[keys[i]] || [], 'validate')) {
                            var err = __versaShared.steps[keys[i]].validate();

                            if (err) {
                                return false;
                            }
                        }



                        //Validar se terá alguma validação ao mudar o step no formulário e se for o step da validação configurada
                        if (__versaShared.options.verificarEntrarStepWizard !== undefined && __versaShared.options.verificarEntrarStepWizard[indexAbaDestino] !== undefined &&
                            //Verificar se já foi validado
                            !__versaShared.options.verificarEntrarStepWizard[indexAbaDestino]['valido'] &&
                            //Verificar alguma condição passada que possa impedir essa validação
                            (__versaShared.options.verificarEntrarStepWizard[indexAbaDestino]['condicao'] === undefined || __versaShared.options.verificarEntrarStepWizard[indexAbaDestino]['condicao']())) {
                            $.SmartMessageBox({
                                title: "Atenção:",
                                content: __versaShared.options.verificarEntrarStepWizard[indexAbaDestino]['mensagem'],
                                buttons: "[Não][Sim]",
                            }, function (ButtonPress) {
                                if (ButtonPress == "Sim") {
                                    __versaShared.options.verificarEntrarStepWizard[indexAbaDestino]['valido'] = true;

                                    $(__versaShared.options.wizardElement).bootstrapWizard('next');
                                    showButtonSubmit(indexAbaDestino, objNavegacao);
                                    return true;
                                }
                            });

                            return false;
                        }

                        $(__versaShared.options.wizardElement).bootstrapWizard('next');
                        showButtonSubmit(indexAbaDestino, objNavegacao);
                    }

                    return false;
                }
            },
            onNext: function (objAbaAtiva, objNavegacao) {
                var indexAbaAtiva = objAbaAtiva.index();
                var keys = Object.keys(__versaShared.steps);


                if (__versaShared.isFunction(__versaShared.steps[keys[indexAbaAtiva]] || [], 'validate')) {
                    var err = __versaShared.steps[keys[indexAbaAtiva]].validate();

                    if (err) {
                        return false;
                    }
                }

                showButtonSubmit(keys + 1, objNavegacao);
            }
        });
    };

    this.makeSelect2Field = function (settings) {
        settings = settings || [];
        settings = $.extend(true, {
            fieldId: '',
            optionsAttr: '',
            dataAttr: '',
            ajax: false,
            data: null,
            select2Extra: {},
            changeCallback: null
        }, settings);

        if (!settings.dataAttr) {
            settings.dataAttr = settings.optionsAttr;
        }

        return {
            settings: settings,
            setValue: function (option) {
                option = option || null;
                __versaShared.options.value[this.settings.optionsAttr] = option;
                $(this.settings.fieldId).select2("val", option);
            },
            setValueBySearch: function (search) {
                var data = __versaShared.options.data[this.settings.dataAttr] || null;

                if (!data) {
                    return;
                }

                var selection = $.grep(data, function (el) {
                    if (el.id == search || el.text.toLowerCase() == search.toLowerCase()) {
                        return el;
                    }
                });

                if (!this.settings.select2Extra.multiple && !this.settings.select2Extra.tags) {
                    selection = selection[0] || null;
                }

                this.setValue(selection || null);
            },
            getValue: function () {
                return __versaShared.options.value[this.settings.optionsAttr];
            },
            init: function () {
                var select2Helper = this;
                var select2Options = {
                    language: 'pt-BR',
                    allowClear: true,
                    initSelection: function (element, callback) {
                        callback(select2Helper.getValue());
                    }
                };

                if (this.settings.ajax) {
                    select2Options['ajax'] = {url: '', dataType: 'json', delay: 250, data: null, results: ''};
                    select2Options['ajax'] = $.extend(true, select2Options['ajax'], this.settings.ajax);
                    delete select2Options['data'];
                } else if (this.settings.data) {
                    select2Options['data'] = this.settings.data;
                    delete select2Options['ajax'];
                } else {
                    delete select2Options['ajax'];
                    delete select2Options['data'];
                }

                if (this.settings.select2Extra) {
                    select2Options = $.extend(true, select2Options, this.settings.select2Extra);
                }

                $(this.settings.fieldId).select2(select2Options);

                if (this.settings.select2Extra.allowClear) {
                    $(this.settings.fieldId).on(
                        'change select2-selected select2-clearing select2-removed',
                        function () {
                            var $item = $(this);

                            if ($item.val() != '') {
                                $item.parent().find('.select2-container').addClass('select2-allowclear');
                            } else {
                                $item.parent().find('.select2-container').removeClass('select2-allowclear');
                            }
                        });
                }

                if (this.settings.changeCallback) {
                    $(this.settings.fieldId).on('change', this.settings.changeCallback);
                }
                $(this.settings.fieldId).select2("val", select2Helper.getValue());
                $(this.settings.fieldId).trigger('change');
                $(this.settings.fieldId).data('select2Util', this);
            }
        };
    };

    this.procuraValorArraySelect2 = function (needle, haystack) {
        if (!needle || !haystack) {
            return false;
        }

        return $.grep(haystack, function (el) {
            if (el.id == needle) {
                return el;
            }
        });
    };

    this.getOption = function (option, container) {
        container = container || this.options;
        option = option || false;

        if (container[option]) {
            return container[option];
        }

        return false;
    };

    this.setOption = function (option, value, container) {
        container = container || this.options;
        option = option || false;
        value = value || false;
        container[option] = value;
    };

    this.getDatatable = function (datatableName) {
        return this.getOption(datatableName, this.options.datatable);
    };

    this.setDatatable = function (datatableName, datatable) {
        this.setOption(datatableName, datatable, this.options.datatable);
    };

    this.formatNumberUS = function (num, fixed) {
        if (isNaN(num) || num == null) {
            return '';
        }

        var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
        var newNum = num.toString().match(re)[0];
        return this.formatNumber(newNum, fixed);
    };

    this.formatNumber = function (number, dec, dsep, tsep) {
        if (isNaN(number) || number == null) {
            return '';
        }

        dec = dec || 2;
        dsep = dsep || '.';
        tsep = tsep || '';

        var newNumber = parseFloat(number).toFixed(~~dec);

        var parts = newNumber.split('.');
        var fnums = parts[0];
        var decimals = parts[1] ? (dsep || '.') + parts[1] : '';

        return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
    };

    this.formatDate = function (date, format, horario_brasilia, retornar_objeto = false) {
        date = date || null;
        format = format || "dd/mm/yy";

        if (date && date.length <= 11) {
            date = date + ' 05:00'
        }

        if (date) {
            if (date.toString().indexOf('/') != -1) {
                date = date.replace(/(\d{2})\/(\d{2})\/(\d{4})(.*)/, "$3/$2/$1$4");
            }

            date = new Date(date);

            if (isNaN(date)) {
                date = null;
            }
            if (date && horario_brasilia) {
                var hora_oficial = date.getUTCHours();
                var hora_brasilia = hora_oficial - 3;
                date.setHours(hora_brasilia);
            }
        }

        if (retornar_objeto === false) {
            if (date) {
                date = $.datepicker.formatDate(format, date);
            } else {
                date = '-';
            }
        }

        return date;
    };

    this.formatDateTime = function (date, format, horario_brasilia) {
        date = date || null;
        format = format || 'dd/mm/yy hh:ii';

        if (!$['formatDateTime']) {
            format = format.replace('hh:ii', '').trim();
            return __versaShared.formatDate(date, format, horario_brasilia);
        }

        if (date) {
            if (date.toString().indexOf('/') != -1) {
                date = date.replace(/(\d{2})\/(\d{2})\/(\d{4})(T|)(.*)/, "$3/$2/$1 $5").trim();
            }

            date = new Date(date);

            if (isNaN(date)) {
                date = null;
            }
            if (date && horario_brasilia) {
                var hora_oficial = date.getUTCHours();
                var hora_brasilia = hora_oficial - 3;
                date.setHours(hora_brasilia);
            }
        }

        if (date) {
            date = $.formatDateTime(format, date);
        } else {
            date = '-';
        }

        return date;
    };

    // calcula a idade considerando os parâmetros 
    // 'nascimento' e 'hoje' como objetos Date
    this.calculaIdade = function (nascimento, hoje) {
        return Math.floor(Math.ceil(Math.abs(nascimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24)) / 365.25);
    };

    this.createBtnGroup = function (btns, options) {
        btns = btns || [];
        options = options || [];
        var btnArr = [];
        var align = (options['align'] || 'center');
        for (var i in btns) {
            var size = (btns[i]['size'] || 'xs');
            var title = (btns[i]['title'] || '');
            var text = (btns[i]['text'] || '');
            var element = (btns[i]['element'] || 'button');
            var type = (btns[i]['type'] || 'button');
            var target = (btns[i]['target'] || '');
            var icon = (btns[i]['icon'] || '');
            var iconNoInverse = (btns[i]['iconNoInverse'] || false);
            var href = (btns[i]['href'] || '#');
            var id = (btns[i]['id'] || '');
            var dataToggle = (btns[i]['dataToggle'] || '#');
            var dataTarget = (btns[i]['dataTarget'] || '#');
            var cssClass = (btns[i]['class'] || '');
            cssClass = 'btn' + (size ? ' btn-' + size : '') + (cssClass ? ' ' + cssClass : '');
            cssClass = ' class="' + cssClass + '"';

            if (element == 'a') {
                target = target ? ' target="' + target + '"' : '';
                href = href ? ' href="' + href + '"' : '';
                type = '';
            } else if (element == 'button') {
                type = type ? ' type="' + type + '"' : '';
                target = '';
                href = '';
            }

            if (id) {
                id = ' id="' + id + '"';
            }

            if (title) {
                title = ' title="' + title + '"';
            }

            if (dataTarget) {
                dataTarget = ' data-target="' + dataTarget + '"';
            }

            if (dataToggle) {
                dataToggle = ' data-toggle="' + dataToggle + '"';
            }

            if (icon) {
                icon = '<i class="fa ' + icon + (iconNoInverse ? '' : ' fa-inverse') +'"></i>';
            }

            btnArr.push(
                '<' + element + type + href + target + cssClass + title + dataTarget + dataToggle + id + '>' + icon + text + '</' + element + '>'
            );
        }

        return '<div class="text-' + align + '"><div class="btn-group">' + btnArr.join('\n') + '</div></div>';
    };

    this.strToUnderscore = function (str) {
        return (str.charAt(0).toLowerCase() + str.slice(1) || str).toString();
    };

    this.strToCamelCase = function (str) {
        return str.replace(/(_\w)/g, function (m) {
            return m[1].toUpperCase();
        });
    };

    this.keysToUnderscore = function (o) {
        var build, key, destKey, value;

        if (o instanceof Array) {
            build = [];

            for (key in o) {
                value = o[key];

                if (typeof value === "object") {
                    value = __versaShared.keysToUnderscore(value);
                }

                build.push(value);
            }
        } else {
            build = {};

            for (key in o) {
                if (o.hasOwnProperty(key)) {
                    destKey = __versaShared.strToUnderscore(key);
                    value = o[key];

                    if (value !== null && typeof value === "object") {
                        value = __versaShared.keysToUnderscore(value);
                    }

                    build[destKey] = value;
                }
            }
        }

        return build;
    };

    this.keysToCamelCase = function (o) {
        var build, key, destKey, value;

        if (o instanceof Array) {
            build = [];

            for (key in o) {
                value = o[key];

                if (typeof value === "object") {
                    value = __versaShared.keysToCamelCase(value);
                }

                build.push(value);
            }
        } else {
            build = {};

            for (key in o) {
                if (o.hasOwnProperty(key)) {
                    destKey = __versaShared.strToCamelCase(key);
                    value = o[key];

                    if (value !== null && typeof value === "object") {
                        value = __versaShared.keysToCamelCase(value);
                    }

                    build[destKey] = value;
                }
            }
        }

        return build;
    };

    this.formatarMoeda = function (valor) {
        if (!valor && valor !== 0) {
            return '-';
        }

        valor = parseFloat(valor) || 0;
        valor = __versaShared.formatNumber(valor, 2, ',', '.');
        return valor;
    };

    this.formatarMoedaUS = function (valor) {
        if (!valor && valor !== 0) {
            return 0;
        }

        if (valor['indexOf']) {
            valor = valor.replace(/[^0-9,]/, '').replace(',', '.');
        }


        valor = parseFloat(valor) || 0;

        return valor;
    };

    this.iniciarElementoDatePicker = function (el, extraOptions) {
        extraOptions = extraOptions || {};
        var datetimeOptions = $.extend(
            [],
            {
                format: 'd/m/Y',
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>'
            },
            extraOptions
        );
        el.datepicker(datetimeOptions);
        el.inputmask({showMaskOnHover: false, clearIncomplete: true, mask: ['99/99/9999']});

        return el;
    };

    this.iniciarElementoDatePickerRange = function (dateStart, dateEnd, extraOptions) {
        extraOptions = extraOptions || {};

        this.iniciarElementoDatePicker(dateStart, extraOptions);
        this.iniciarElementoDatePicker(dateEnd, extraOptions);

        dateStart.on("change", function() {
            dateEnd.datepicker("option", "minDate", dateStart.val());
        });
        dateEnd.on("change", function() {
            dateStart.datepicker("option", "maxDate", dateEnd.val());
        });
    };

    this.iniciarElementoDatePickerIntervalo = function (datepickerInicial, datepickerFinal) {
        __versaShared.iniciarElementoDatePicker(datepickerInicial);
        __versaShared.iniciarElementoDatePicker(datepickerFinal);

        datepickerInicial.on("change", function () {
            datepickerFinal.datepicker(
                "option",
                "minDate",
                $.datepicker.parseDate("dd/mm/yy", this.value)
            );
        });

        datepickerFinal.on("change", function () {
            datepickerInicial.datepicker(
                "option",
                "maxDate",
                $.datepicker.parseDate("dd/mm/yy", this.value)
            );
        });
    };

    this.iniciarElementoDateTimePicker = function (el, extraOptions) {
        if ($['datetimepicker']) {
            extraOptions = extraOptions || {};
            var datetimeOptions = $.extend(
                {},
                {
                    format: 'd/m/Y H:i',
                    prevText: '<i class="fa fa-chevron-left"></i>',
                    nextText: '<i class="fa fa-chevron-right"></i>'
                },
                extraOptions
            );

            el.datetimepicker(datetimeOptions);
            el.inputmask({showMaskOnHover: false, clearIncomplete: true, mask: ['99/99/9999 99:99']});

            return el;
        } else {
            return __versaShared.iniciarElementoDatePicker(el, extraOptions);
        }

    };

    this.iniciarElementoTimePicker = function (el, extraOptions) {
        if ($['datetimepicker']) {
            extraOptions = extraOptions || {};
            var datetimeOptions = $.extend(
                {},
                {
                    datepicker: false,
                    format: 'H:i',
                    prevText: '<i class="fa fa-chevron-left"></i>',
                    nextText: '<i class="fa fa-chevron-right"></i>'
                },
                extraOptions
            );

            el.datetimepicker(datetimeOptions);

        }

        el.inputmask("hh:mm", {
            placeholder: "__:__", 
            showMaskOnHover: false, 
            clearIncomplete: true, 
            hourFormat: "24",
        });

        return el;
    };

    this.inciarElementoInteiro = function (el, extraOptions) {
        var options = {...{showMaskOnHover: false, mask: ['9{0,9}'], rightAlign: true}, ...extraOptions};
        el.inputmask(options);

        return el;
    };

    this.inciarElementoSomenteLetras = function (el) {
        el.inputmask("Regex", {regex: "^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$"})
        return el;
    };

    this.inciarElementoMoeda = function (el, extraOptions) {
        var options = {
            ...{
                showMaskOnHover: false,
                alias: 'currency',
                groupSeparator: "",
                radixPoint: ",",
                placeholder: "0",
                prefix: "",
                allowMinus: false
            }, ...extraOptions
        };

        el.inputmask(options);

        return el;
    };

    this.inciarElementoHora = function (el, extraOptions) {
        el.inputmask({
            showMaskOnHover: false, alias: 'currency', groupSeparator: "", radixPoint: ":",
            placeholder: "0", prefix: "", allowMinus: false, integerDigits: 5, ...extraOptions
        });
        return el;
    };

    this.roundNumber = function (num, scale) {
        // Solução original https://stackoverflow.com/a/12830454
        num = parseFloat(num);

        var number = Math.round(num * Math.pow(10, scale)) / Math.pow(10, scale);

        if (num - number > 0) {
            return (number + Math.floor(2 * Math.round((num - number) * Math.pow(10, (scale + 1))) / 10) / Math.pow(10, scale));
        } else {
            return number;
        }
    };

    /*
     *   FUNÇÃO QUE RETORNA OS VALORES DE UM FORM-STATIC
     *   @param $ el
     *   @return json
     */
    this.getFormStaticValues = function (el) {
        var arr = [];

        el.find('.form-control-static').each(function (index, element) {
            var key = ($(element).attr('class')).replace(/.* /, '');
            var value = $(element).text();

            arr.push({
                key: key,
                value: value
            });
        });

        return arr;
    };


    this.validaCPF = function (cpf) {
        var numeros, digitos, soma, i, resultado, digitos_iguais;
        digitos_iguais = 1;
        if (cpf.length < 11)
            return false;
        for (i = 0; i < cpf.length - 1; i++)
            if (cpf.charAt(i) != cpf.charAt(i + 1)) {
                digitos_iguais = 0;
                break;
            }
        if (!digitos_iguais) {
            numeros = cpf.substring(0, 9);
            digitos = cpf.substring(9);
            soma = 0;
            for (i = 10; i > 1; i--)
                soma += numeros.charAt(10 - i) * i;
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0))
                return false;
            numeros = cpf.substring(0, 10);
            soma = 0;
            for (i = 11; i > 1; i--)
                soma += numeros.charAt(11 - i) * i;
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1))
                return false;
            return true;
        } else
            return false;
    };

    this.systemDialog = function (extraOptions, success, error) {
        extraOptions = $.extend(
            true,
            {
                acccpt: "Aceitar",
                cancel: "Cancelar",
                close: "Fechar",
                confirm: "Confirmar",
                decline: "Recusar",
                deny: "Negar",
                maximize: "Maximizar",
                ok: "OK",
                restore: "Restaurar",
                title: "Atenção!"
            },
            extraOptions
        );

        alertify.defaults = {
            transition: 'pulse',
            theme: {
                ok: "btn btn-primary",
                cancel: "btn btn-danger"
            },
            glossary: extraOptions
        };

        return alertify.confirm(extraOptions['message'] || "Deseja prosseguir?", success, error);
    };

    this.formClear = function (form, table) {
        form = $(form) || false;

        if (table) {
            table.fnClearTable();
        }

        if (!form) {
            return false;
        }

        form.validate().resetForm();

        form.find("div[id^='s2id_']").each(
            function (a, b) {
                $(b).next().select2('val', '').trigger("change")
            }
        );

        form.find('.help-block').remove();
        form.find(".has-error").removeClass("has-error");
        form[0].reset();
    };

    this.strip = function (str, c) {
        var tmp = str.split(c);
        return tmp.join("");
    };

    this.formatarData = function (data, formato = null, time = false) {
        if (typeof data === 'object')
            return moment(data).format("DD/MM/YYYY");

        if (!data)
            return false;

        if (formato === null || formato === "/") {
            data = data.split("/");

            return new Date(data[2], parseInt(data[1]) - 1, data[0]);
        } else if (formato === "-") {
            data = data.split("-");

            if (time) {
                return data[2].slice(0, 2) + '/' + data[1] + '/' + data[0] + ' ' + data[2].slice(3, 11);
            }
            return data[2].slice(0, 2) + '/' + data[1] + '/' + data[0];
        }

        return ' - ';

    };

    this.isValidDate = function (dateString) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateRegex.test(dateString)) {
            return false;
        }

        const dateObject = new Date(dateString);

        return (
            !isNaN(dateObject.getTime()) &&
            dateObject.toISOString().slice(0, 10) === dateString
        );
    }

    this.formatarDataHora = function (data) {
        if (typeof data === 'object')
            return moment(data).format("DD/MM/YYYY");

        if (!data)
            return false;

        data = data.split("/");
        var dataHora = data[2].split(' ');

        data[2] = dataHora[0];
        var hora = dataHora[1].split(':');

        return new Date(data[2], parseInt(data[1]) - 1, data[0], hora[0], hora[1], hora[2]);
    };

    this.formatarDataHoraParaBR = function (data, format = "DD/MM/YYYY HH:mm") {
        return moment(data).format(format);
    };

    this.in_array = function (needle, haystack, campo) {
        if (!needle || !haystack) {
            return false;
        }

        for (var row in haystack) {
            if (haystack[row] == needle || (campo && haystack[row][campo] == needle))
                return true;
        }

        return false;
    };

    this.mascaraCnpjCpf = function (value) {
        if (value != "") {
            var tmp = this.strip(value, ".");
            tmp = this.strip(tmp, "/");
            tmp = this.strip(tmp, "-");

            if (12 < tmp.length) value = (tmp.substr(0, 2) + '.' + tmp.substr(2, 3) + '.' + tmp.substr(5, 3) + '/' + tmp.substr(8, 4) + '-' + tmp.substr(12, 2));
            else if (9 < tmp.length) value = (tmp.substr(0, 3) + '.' + tmp.substr(3, 3) + '.' + tmp.substr(6, 3) + '-' + tmp.substr(9, 3));
            else if (6 < tmp.length) value = (tmp.substr(0, 3) + '.' + tmp.substr(3, 3) + '.' + tmp.substr(6, 3));
            else if (3 < tmp.length) value = (tmp.substr(0, 3) + '.' + tmp.substr(3, 3));
            else value.val(tmp);
        }
        return value;
    };

    this.convertToSnakeCase = function (text) {
        return text.replace(/\.?([A-Z])/g, function (x, y) {
            return "_" + y.toLowerCase()
        }).replace(/^_/, "");
    };

    this.buscarFuncionalidadesUsuario = function (objFuncionalidades) {
        let arrFuncionalidades = [];

        if (this.options.url.urlFuncionalidadesUsuario === undefined && this.options.url.urlFuncionalidadesUsuario != "") {
            this.showNotificacaoInfo('Defina a url para buscar as permissões do usuário!');
            return objFuncionalidades;
        }

        $.ajax({
            url: this.options.url.urlFuncionalidadesUsuario,
            dataType: 'json',
            type: 'post',
            async: false,
            data: {
                arrFuncionalidades: objFuncionalidades
            },
            success: function (data) {
                if (data.data !== undefined) {
                    arrFuncionalidades = data.data;
                }
            }
        });

        return arrFuncionalidades;
    };

    /**
     * Função utilizada para formatar os minutos em 'hh:mm'
     * @param valor
     * @param array
     * @returns {*[]|string}
     */
    this.formatarMinutoHora = function (valor, array = false) {
        if (valor === null || valor == "") {
            if (array) {
                return [0, 0];
            }
            return "";
        }


        var hora = (valor / 60);
        var minuto = (valor % 60);

        var ultimaPos = hora.toString().indexOf('.');
        if (ultimaPos >= 0) {
            hora = hora.toString().substr(0, ultimaPos);
        }

        if (array) {
            return [hora * 1, minuto * 1];
        }

        return (hora.toString().padStart(2, '0') + ':' + minuto.toString().padStart(2, '0'));
    };

    this.formatarHora = function (valor, array = false) {
        if (valor === null || valor == "") {
            return "";
        }

        valor = valor.toString().split(':');
        if (valor[1] === undefined) {
            valor[1] = '0';
        }

        if (array) {
            valor[0] *= 1;
            valor[1] *= 1;
            return valor;
        }

        valor[0] = valor[0].padStart(2, '0');
        valor[1] = valor[1].padStart(2, '0');
        return valor.join(':');
    };

    this.retornarApenasNumero = function (valor) {
        if (typeof valor == 'string') {
            return valor.match(/\d+/g)[0];
        }

        return valor;
    };

    this.iniciarElementoCpfCnpj = function (el) {
        $(el).keyup(function () {
            var options = {
                showMaskOnHover: true,
                mask: ['99.999.999/9999-99']
            };

            if (el.val() !== '' && el.val().replace(/\D/g, '').length <= 11) {
                options.mask = ['999.999.999-99[9]'];
            }

            el.inputmask(options);
        });

        return el;
    };

    this.iniciarElementoTelefoneCelular = function (el) {
        $(el).inputmask({
            showMaskOnHover: false,
            mask: ['(99) 9999-9999', '(99) 99999-9999']
        });

        return el;
    };

    this.iniciarElementoCep = function (el, extraOptions) {
        //Ao passar valor pelo objeto extraOptions, abaixo irá concatenar ou sobrescrever as posições passadas
        var options = {
            ...{
                showMaskOnHover: false,
                clearIncomplete: false,
                mask: ['99999-999']
            }, ...extraOptions
        };

        $(el).inputmask(options);
        return el;
    };

    this.bloquearCopiarValorCampo = function (campo) {
        $(campo).bind('copy', function (e) {
            e.preventDefault();
        });
    };

    this.bloquearColarValorCampo = function (campo) {
        $(campo).bind('paste', function (e) {
            e.preventDefault();
        });
    };

    /**
     * FUNCAO PARA FORMATAR TAMANHO DO ARQUIVO ANEXADO
     */
    this.formatFileSize = function(bytes) {
        if(bytes == 0) {
            return '0 Bytes';
        }

        let byteSize = 1024;
        let arrSizeDescription = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let index = Math.floor(Math.log(bytes) / Math.log(byteSize));

        return `${parseFloat((bytes / Math.pow(byteSize, index)).toFixed(2))} ${arrSizeDescription[index]}`;
    };

    this.copiarTexto = function (valor) {

        navigator.clipboard.writeText(valor);

    };

    /**
     * Esta função retornará a data atual em horário de brasília
     * @returns {Date}
     */
    this.retornarNovaDataHorarioBrasilia = function () {
        var data = new Date();
        data.setHours(data.getUTCHours() -3);
        return data;
    }

    this.isMobile = function () {
        if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
        ){
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Comparar e retornar a diferença entre as datas
     * @param data1
     * @param data2
     * @param tipo
     * @returns {*}
     */
    this.retornarDiferencaDatas = function (data1, data2, tipo = 'months') {
        if (!data1 || !data2) {
            return 0;
        }

        var inicial = moment(parseInt(data1.getFullYear()) + '-' + (parseInt(data1.getMonth()) + 1) + '-' + parseInt(data1.getDate()));
        var final = moment(parseInt(data2.getFullYear()) + '-' + (parseInt(data2.getMonth()) + 1) + '-' + parseInt(data2.getDate()));

        var retorno = null;

        switch (tipo) {
            case 'months':
                retorno = final.diff(inicial, 'months');
                break;
            case 'days':
                retorno = final.diff(inicial, 'days');
                break;
            default:
                retorno = final.diff(inicial, 'year');
                break;
        }

        return retorno;
    }

    /**
     * converte numero para tempo em extenso
     * @param numero 
     */
    this.numeroParaTempoExtenso = function (numero = 0) {

        let days = numero/(24*60);
        let hour = (numero%(24*60)) / 60;
        let minutes = (numero%(24*60)) % 60;

        return parseInt(days) + " dia(s) e " + parseInt(hour) + " horas(s) e " + minutes + " minuto(s)."; 
    }

    /**
     * converte numero para tempo
     * @param numero 
     */
    this.numeroParaTempo = function (numero = 0, casaDecimalHr = 2, casaDecimalMin = 2) {
        
        let hours = Math.floor(numero / 60);  
        let minutes = numero % 60;

        let horaFormata = ("0000000000" + hours).slice(-casaDecimalHr) + ":"  + ("0000000000" + minutes).slice(-casaDecimalMin)

        return horaFormata;
    }

    /**
     * converte tempo para numero, o tempo só considera HORA:MINUTO
     * @param time 
     */
    this.tempoParaNumero = function (time = "000:00") {
        let array = time.split(':');
        return parseInt(array[0]) * 60 + parseInt(array[1]);
    }

    /**
     * Retorna o objeto de data tratado para ser compatível com outros navegadores
     * @param stringData
     */
    this.criarObjetoData = function (stringData) {
        if (!stringData) {
            return null;
        }

        return new Date(stringData.replace(' ', 'T'));
    }

    /**
     * Retorna a validação do intervalo de datas
     * @param dataCadastroInicial
     * @param dataCadastroFinal
     * @param mesesIntervalo
     */
    this.validarIntervaloData = function (dataCadastroInicial, dataCadastroFinal, mesesIntervalo = 6) {
        //Validar a data de cadastro no intervalo de x meses.
        dataCadastroInicial = dataCadastroInicial.datepicker('getDate');
        dataCadastroFinal = dataCadastroFinal.datepicker('getDate');

        if (!dataCadastroInicial || !dataCadastroFinal) {
            return false;
        }

        var meses = this.retornarDiferencaDatas(dataCadastroInicial, dataCadastroFinal);

        dataCadastroInicial.setMonth(dataCadastroFinal.getMonth());
        dataCadastroInicial.setFullYear(dataCadastroFinal.getFullYear());
        var dia = this.retornarDiferencaDatas(dataCadastroInicial, dataCadastroFinal, 'days');

        return !(meses > mesesIntervalo || (meses == mesesIntervalo && dia > 0));
    }

    /**
     * Preenche campos de formulário automaticamente
     *
     * @todo Necessário implementar tratativas para checkbox, radio e outras tipagens para de input
     * @author <luizfernando8966@gmail.com> Luiz F. Vieira
     * @param {string} formElementId String com o ‘id’ do formulário
     * @param {object} inputFields Objeto com chave e valor dos campos a serem preenchidos
     */
    this.fillForm = function (formElementId, inputFields) {
        const formElement = $(formElementId);
        const formFields = formElement.serializeJSON();

        Object.keys(formFields).forEach(function (inputName) {
            formFields[inputName] = null;
        });

        inputFields = $.extend(formFields, inputFields || {});

        Object.entries(inputFields).forEach(function (input) {
            const name = input[0];
            const value = input[1];
            const inputElement = formElement.find(`[name=${name}]`);
            const isSelect2 = inputElement.data("select2");
            const inputType = inputElement.attr("type");

            if (isSelect2) {
                if (typeof value === "object") {
                    inputElement.select2("data", value).trigger("change");
                } else {
                    inputElement.select2("val", value).trigger("change");
                }

                return;
            }

            switch (inputType) {
                case "checkbox":
                    inputElement.prop("checked", value || false);
                    break;

                case "radio":
                    formElement.find(`[value=${value}]`).prop("checked", true);
                    break;

                default:
                    inputElement.val(value);
                    break;
            }
        });
    }

    /**
     * Retira classes de validação adicionadas pelo plugin "validate"
     *
     * @author <luizfernando8966@gmail.com> Luiz F. Vieira
     * @param {object} objFormElement
     */
    this.resetValidateForm = function (objFormElement) {
        objFormElement.validate().resetForm();
        objFormElement.find(".has-error").removeClass("has-error");
        objFormElement.find(".has-success").removeClass("has-success");
        objFormElement.find(".has-warning").removeClass("has-warning");
    }

    this.array_combine = function (keys, values, valida_vazio = true) {
        const newArray = {};
        let i = 0;
        
        if (typeof keys !== 'object') {
          return false;
        }
        if (typeof values !== 'object') {
          return false;
        }
        if (typeof keys.length !== 'number') {
          return false;
        }
        if (typeof values.length !== 'number') {
          return false;
        }
        if (!keys.length) {
          return false;
        }
        for (i = 0; i < keys.length; i++) {
            var key = keys[i];
            var valor = values[i];

            if (valida_vazio) {
                if (valor.length > 0) {
                    newArray[key] = valor;
                }
            } else {
                newArray[key] = valor;
            }
        }

        return newArray;
    }

    this.iniciarElementoSummernote = function (element, options) {
        if (
            $(document).find(`[src="*summernote/summernote.min.js"]`) ||
            $(document).find(`[src="*summernote/summernote.js"]`)
        ) {
            let defaultOptions = {
                dialogsInBody: true,
                codeviewIframeFilter: true,
                focus: false,
                height: 200,
                lang: "en-US",
                toolbar: [
                    ['style', ['style']],
                    ['font', ['fontname', 'fontsize']],
                    ['fontstyle', ['color', 'bold', 'italic', 'underline', 'strikethrough',
                        'superscript', 'subscript', 'clear']],
                    ['para', ['ul', 'ol', 'paragraph', 'height']],
                    ['insert', ['link', 'picture', 'video', 'table', 'hr']],
                    ['view', ['fullscreen', 'codeview', 'undo', 'redo', 'help']],
                ],
                popover: {
                    image: [
                        ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
                        ['float', ['floatLeft', 'floatRight', 'floatNone']],
                        ['remove', ['removeMedia']]
                    ],
                    link: [
                        ['link', ['linkDialogShow', 'unlink']]
                    ],
                    table: [
                        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
                        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
                    ],
                    air: [
                        ['color', ['color']],
                        ['font', ['bold', 'underline', 'clear']],
                        ['para', ['ul', 'paragraph']],
                        ['table', ['table']],
                        ['insert', ['link', 'picture']]
                    ]
                },
                fontNames: [
                    "Arial", "Comic Sans MS", "Courier new", "Helvetica Neue Light", "Helvetica",
                    "Lucida Grande", "Tahoma", "Times New Roman", "Footlight MT Light", "Open Sans",
                    "Calibri", "Certificate", "Century Gothic"],
                fontNamesIgnoreCheck: [
                    "Calibri", "Certificate", "Century Gothic"
                ],
                callbacks: {
                    onImageUpload: function (image) {
                        const data = new FormData();
                        const img = image[0];

                        data.append("file", img);

                        $.ajax({
                            data: data,
                            type: "POST",
                            url: `${window.location.origin}/gerenciador-arquivos`,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: data => element.summernote("insertImage", data.url),
                            error: data => console.log(data)}
                        );
                    }
                }
            }

            if(
                $(document).find(`[src="*summernote/lang/summernote-pt-BR.min.js"]`) ||
                $(document).find(`[src="*summernote/lang/summernote-pt-BR.js"]`)
            ) {
                defaultOptions.lang = "pt-BR";
            }

            if (
                $(document).find(`[src="*summernote-style-link/summernote-style-link-btn.min.js"]`) ||
                $(document).find(`[src="*summernote-style-link/summernote-style-link-btn.js"]`)
            ) {
                defaultOptions.popover.link = defaultOptions.popover.link.map(link => {
                    if (link[0] === "link") {
                        link[1].push("styleLinkBtn");
                    }

                    return link;
                });
            };

            element.summernote($.extend(defaultOptions, options || {}));
        }

        return element;
    };

    this.iniciarElementoCkEditor = function(element, options) {
        if ($(document).find(`[src="*plugin/ckeditor"]`)) {
            let defaultOptions = {
                height: '200px', 
                linkShowAdvancedTab: false,
                autoStartup: true,
                contentsCss: window.urlCssCKEDITOR,
                extraAllowedContent: (
                    'style;body;*{*};' +
                    'img[src,alt,width,height,style,class];' +
                    'td[class,colspan,width,height,style];' +
                    'th[class,colspan,width,height,style];' +
                    'tr[class,style];' +
                    'h1[class,width,height,style];' +
                    'h2[class,width,height,style];' +
                    'h3[class,width,height,style];' +
                    'div[class,width,height,style];' +
                    'span[class,width,height,style];' +
                    'p[class,width,height,style];' +
                    'table[src,alt,width,height,style]'
                ),
                enterMode: Number(2),
                toolbar: [
                    [
                        'Styles', 'Bold', 'Italic', 'Underline', 'SpellChecker', 'Scayt', '-',
                        'NumberedList', 'BulletedList'
                    ],
                    ['Table'],
                    ['Link', 'Unlink'],
                    ['Undo', 'Redo', '-', 'SelectAll'],
                    ['Maximize']
                ]
            };

            CKEDITOR.env.isCompatible = true;
            element.ckeditor($.extend(defaultOptions, options || {}));
        }

        return element;
    };

    this.isDoubleClicked = function (element, delay=1000) {
        if (element.data("isclicked")) return true;

        element.data("isclicked", true);
        setTimeout(function () {
            element.removeData("isclicked");
        }, delay);

        return false;
    }

    this.downloadFile = function (pdfData = '', link = '', contentType = "application/pdf", attachmentName = "document.pdf") {
        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        var isChrome =
            navigator.userAgent.toLowerCase().indexOf("CriOS") > -1 ||
            navigator.vendor.toLowerCase().indexOf("google") > -1;
        var iOSVersion = [];
        if (iOS) {
            iOSVersion = navigator.userAgent
                .match(/OS [\d_]+/i)[0]
                .substr(3)
                .split("_")
                .map((n) => parseInt(n));
        }
            
        var linkElement = document.createElement("a");

        try {
            var hrefUrl = "";
            var blob = "";
            
            if (pdfData) {
                var binary = atob(pdfData.replace(/\s/g, ""));
                var len = binary.length;
                var buffer = new ArrayBuffer(len);
                var view = new Uint8Array(buffer);
                
                for (var i = 0; i < len; i++) {
                    view[i] = binary.charCodeAt(i);
                }

                if (iOS && !isChrome && iOSVersion[0] <= 12) {
                    blob = "data:application/pdf;base64," + pdfData;
                    hrefUrl = blob;
                } else {
                    if (iOS && !isChrome) {
                        contentType = "application/octet-stream";
                    }
                    blob = new Blob([view], { type: contentType });
                    hrefUrl = window.URL.createObjectURL(blob);
                }
            } else if (link) {
                hrefUrl = link;
            }
            
            linkElement.setAttribute("href", hrefUrl);
            linkElement.setAttribute("target", "_blank");
            
            if ((iOS && (iOSVersion[0] > 12 || isChrome)) || !iOS) {
                linkElement.setAttribute("download", attachmentName);
            }
            
            var clickEvent = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: false
            });
            linkElement.dispatchEvent(clickEvent);
        } catch (ex) {}
    };

    this.escapeHtml = function (text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    return this;
};
