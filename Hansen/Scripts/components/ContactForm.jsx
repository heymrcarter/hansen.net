var Regex = {
    nameExpression: /^[a-z ,.'-]+$/i,
    phoneExpression: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i,
    emailExpression: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
    yearExpression: /^(19|20)\d{2}$/i,
    makeExpression: /^$|\s+/i,
    modelExpression: /^$|\s+/i
};

var Validator = (function () {
    return function (field, regex) {
        var subject = field,
            expression = new RegExp(regex);

        function validate() {
            return expression.test(subject);
        }

        return {
            validate: function () {
                return validate();
            }
        };
    };
}());

var InquiryValidator = (function () {
    return function (inquiry) {
        var modelState = {
            error: false,
            errors: []
        };

        var nameValidator = Validator(inquiry.Name, Regex.nameExpression),
            phoneValidator = Validator(inquiry.Phone, Regex.phoneExpression),
            emailValidator = Validator(inquiry.Email, Regex.emailExpression),
            yearValidator = Validator(inquiry.VehicleYear, Regex.yearExpression),
            makeValidator = Validator(inquiry.VehicleMake, Regex.makeExpression),
            modelValidator = Validator(inquiry.VehicleModel, Regex.modelExpression);

        if (!nameValidator.validate()) {
            modelState.error = true;
            modelState.errors.push('Name is required. Please enter a valid name!');
        }

        if (!phoneValidator.validate()) {
            modelState.error = true;
            modelState.errors.push('Phone is required. Please enter a valid phone number, including the area code.');
        }

        if (!emailValidator.validate()) {
            modelState.error = true;
            modelState.errors.push('Email is required. Please enter a valid email address!');
        }

        if (!yearValidator.validate()) {
            modelState.error = true;
            modelState.errors.push('Vehicle year is required. Please enter a valid four digit year!');
        }

        if (makeValidator.validate()) {
            modelState.error = true;
            modelState.errors.push('Vehicle make is required. Please enter a valid vehicle manufacturer!');
        }

        if (modelValidator.validate()) {
            modelState.error = true;
            modelState.errors.push('Vehicle model is required. Please enter a valid model!');
        }

        return {
            validate: function () {
                return modelState;
            }
        };
    };
}());

var ErrorList = React.createClass({
    propTypes: {
        errors: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
    },

    render: function () {
        var errors = this.props.errors.map(function (error, index) {
            return (
                <li key={index+1}>{error}</li>
            );
        });

        return (
            <div>
                <p>Please address the following:</p>
                <ul>
                    {errors}
                </ul>
            </div>
        );
    }
});

var Alert = React.createClass({
    propTypes: {
        type: React.PropTypes.string.isRequired,
        heading: React.PropTypes.string.isRequired,
        id: React.PropTypes.string.isRequired
    },

    componentDidMount: function () {
        var $alert = $('#' + this.props.id);
        var alertTop = $alert.$alert.offset().top;

        $alert.focus();

        $('body').animate({ scrollTop: alertTop + 'px' });
    },

    render: function () {
        var alertClass = 'callout ' + this.props.type;
        
        return (
            <div className={alertClass} id={this.props.id}>
                <h5>{this.props.heading}</h5>
                {this.props.children}
            </div>    
        );
    }
});

var ContactForm = React.createClass({
    propTypes: {
        inquiry: React.PropTypes.object
    },

    render: function () {
        var additionalComments = '';

        if (this.props.inquiry.AdditionalComments !== void (0)) {
            additionalComments = this.props.inquiry.AdditionalComments
        }

        return (
            <form id="contact-form" method="post" action="/contact" className="row" onSubmit={this.submitHandler}>
                <div className="large-12 columns">
                    <label>
                        Name
                        <input type="text" id="Name" name="Name" defaultValue={this.props.inquiry.Name}/>
                    </label>
                </div>

                <div className="large-12 columns">
                    <label>
                        Phone
                        <input type="text" id="Phone" name="Phone" defaultValue={this.props.inquiry.Phone}/>
                    </label>
                </div>

                <div className="large-12 columns">
                    <label>
                        Email
                        <input type="text" id="Email" name="Email" defaultValue={this.props.inquiry.Email}/>
                    </label>
                </div>

                <div className="large-12 columns">
                    <label>
                        Vehicle year
                        <input type="text" id="VehicleYear" name="VehicleYear" defaultValue={this.props.inquiry.VehicleYear}/>
                    </label>
                </div>

                <div className="large-12 columns">
                    <label>
                        Vehicle make
                        <input type="text" id="VehicleMake" name="VehicleMake" defaultValue={this.props.inquiry.VehicleMake}/>
                    </label>
                </div>

                <div className="large-12 columns">
                    <label>
                        Vehicle model
                        <input type="text" id="VehicleModel" name="VehicleModel" defaultValue={this.props.inquiry.VehicleModel}/>
                    </label>
                </div>

                <div className="large-12 columns">
                    <label>
                        Additional comments
                        <textarea id="AdditionalComments" name="AdditionalComments" rows="10" defaultValue={additionalComments} />
                    </label>
                </div>

                <div className="large-12 columns">
                    <button type="submit" className="button">Submit</button>
                </div>
            </form>
        );
    },

    submitHandler: function (event) {
        event.preventDefault();
        var $form = $('#contact-form');
        var data = this.transformData($form.serializeArray());

        var modelState = this.validateData(data);

        if (!modelState.error) {
            console.log('POST: ' + data);
            //$.post($form.attr('action'), data, function (data) {
            //    console.log(data);
            //});
            ReactDOM.render(<Alert type='success' heading='Message received!' id='inquiry-alert'>We've received your inquiry about your {data.VehicleYear} {data.VehicleMake} {data.VehicleModel} and will be in touch soon!</Alert>, document.getElementById('form-container'));
        } else {
            var alert = {
                type: 'alert',
                id: 'inquiry-alert',
                heading: 'Oops! something went wrong!',
                content: <ErrorList errors={modelState.errors} />
            };

            ReactDOM.render(<Inquiry showAlert={true} alert={alert} inquiry={data} />, document.getElementById('form-container'));
        }
    },

    transformData: function (data) {
        var obj = {};

        data.map(function (pair) {
            obj[pair.name] = pair.value;
        });

        return obj;
    },

    validateData: function (data) {
        var validator = InquiryValidator(data);

        return validator.validate();
    }
});

var Inquiry = React.createClass({
    propTypes: {
        alert: React.PropTypes.object,
        inquiry: React.PropTypes.object,
        showAlert: React.PropTypes.bool.isRequired
    },

    render: function () {
        var alert = '';

        if (this.props.showAlert) {
            alert = <Alert type={this.props.alert.type} heading={this.props.alert.heading} id={this.props.alert.id}>{this.props.alert.content}</Alert>
        }

        return (
            <div>
                {alert}
                <ContactForm inquiry={this.props.inquiry} />
            </div>
        );
    }
});

ReactDOM.render(<Inquiry showAlert={false} inquiry={{}} />, document.getElementById('form-container'));