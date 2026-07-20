/**
 * @NApiVersion 2.1
 *
 * Button handlers (client-side)
 */
define(['N/ui/message', 'N/ui/dialog'], (message, dialog) => {
  const showMessage = () => {
    const customMessage = message.create({
      title: 'Custom Message',
      message: 'Hello, NetSuite World!',
      type: message.Type.INFORMATION,
      duration: 5000, // time which the message will be visible (5 seconds, for example).. if not set, it will be visible forever (until "refresh" the page)
    });

    customMessage.show(); // without show(), the message will not be displayed
  };

  const changeColor = () => {
    // add red color to all page elements
    document.head.insertAdjacentHTML(
      'beforeend',
      `<style>*{color: red !important;}</style>`,
    );
  };

  const showDialog = () => {
    dialog
      .confirm({
        title: 'Custom Dialog',
        message: 'Would you like to change the color of all page elements?',
      })
      .then((isOkClicked) => {
        if (isOkClicked) changeColor(); // if "Ok".. change the color of "all" page elements
      });
  };

  return {
    showMessage,
    showDialog,
  };
});
