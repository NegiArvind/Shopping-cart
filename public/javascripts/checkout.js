//This file will run on the frontend not on the backend

Stripe.setPublishableKey("pk_test_BPCkVcKLrZfz3VfWkdkY5y9l00AgGKQG3K");

//This below is jquery function
var $form=$('#checkout-form')
$form.submit(function(event){
  // console.log("hello");
  $('#card-error').addClass('hidden');
  $form.find('button').prop('disabled',true); //disabling button while validation is going on so that user don't submit it again.
  Stripe.card.createToken({
      number: $('#card-number').val(),
      cvc: $('#card-cv').val(),
      exp_month: $('#card- expiry-month').val(),
      exp_year: $('#card- expiry-year').val(),
      name: $('#card-name').val()
    },stripeResponseHandler);
    return false;
});

function stripeResponseHandler(status,response){
  if (response.error) { // Problem!

    // Show the errors on the form
    $('#card-error').text(response.error.message);
    $('#card-error').removeClass('hidden'); //it will remove hidden class that is attached with card-errors div tag.
    $('#button').prop('disabled', false); // Re-enable submission

  } else { // Token was created!

    // Get the token ID:
    var token = response.id;

    // Insert the token into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));

    // Submit the form:
    $form.get(0).submit();
  }
}
