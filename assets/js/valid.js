
function Validator(formSelector) {

    function getParent(element,selector) {
       while (element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement;
       }
    }

    var formRules =  {}

    // Qui ước
    // Nếu có lỗi return lại lỗi

    var ValidatorRules = {

        required: function(value){
            return value ? undefined : "Vui lòng nhập dữ liệu"
        },
        email: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : "Vui lòng nhập email"
        },
        min: function(min){
            return function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} ký tự`
            }
        },
        max: function(max){
            return function(value) {
                return value.length <= max ? undefined : `Vui lòng nhập tối đa ${max} ký tự`
            }
        },
    }

    ValidatorRules

    var formElment = document.querySelector(formSelector);

    if(formElment) {
        var inputs = formElment.querySelectorAll('[name][rules]');
        for(var input of inputs) { 
           var rulers =  input.getAttribute('rules').split('|');

           for(var rule of rulers) {

                var ruleInfo;
                var isRuleHasRule = rule.includes(':')

                if(rule.includes(':')) {
                var ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }

                var ruleFunc = ValidatorRules[rule]

                if(isRuleHasRule) {
                    ruleFunc = ruleFunc(ruleInfo[1])

                }


                if(Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc)
                }else {
                    formRules[input.name] = [ruleFunc]
                }
              
           }

           // Lắng nghe sự kiện validate
           input.onblur = handleValidate;
           input.oninput = handleClear;

        }

        // hàm thực hiện validate
        function handleValidate(e) {
            var rules = formRules[e.target.name];
            var errorMessage; 
            
            rules.some(function(rule) {
                errorMessage =  rule(e.target.value)
                return errorMessage
            })

            // nếu có lỗi
            if(errorMessage) {
                var formGroup =  getParent(e.target , '.form-group')

                if(!formGroup) return;

                if(formGroup) {
                    formGroup.classList.add('invalid')
                    var formMessage = formGroup.querySelector('.form-message')
                    if(formMessage) {
                        formMessage.innerText = errorMessage
                    }
                }
            }
            return !errorMessage
            
        }

          // Hàm xóa giá trị
        function handleClear(e) {
            var formGroup = getParent(e.target , '.form-group')
            if(formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid')

                var formMessage = formGroup.querySelector('.form-message')
                if(formMessage) {
                    formMessage.innerText = ''
                }
            }
        }
       // console.log(formRules)
      
    }

    // Xử lý hành vi sumbit
    formElment.onsubmit = function(e) {
        e.preventDefault();
        var isFormValid = true
        var inputs = formElment.querySelectorAll('[name][rules]');
        for(var input of inputs) {
            if( !handleValidate({target: input})) {
                isFormValid = false
            }
           
        }

        // khi không có lỗi submit
        if(isFormValid) {
            formElment.submit();
        }
    }

}