/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 *
 * Send an "email" with an attached file.
 */
define(['N/email', 'N/file'], (email, file) => {
  const SCRIPT_FILENAME = 'send_email_with_attachment_sl';
  const AUTHOR_ID = 38573; // employee record ID (from Employees list)
  const ATTACHMENT_FILE_ID = 13861; // ID for.. memo_field_validate_checker_cs.js file (from File Cabinet)

  /**
   * @param {OnRequestContext} context
   * @return {void}
   */
  const onRequest = (context) => {
    try {
      const { request, response } = context;
      const attachmentFile = file.load({ id: ATTACHMENT_FILE_ID }); // recommended to use { id: .. } syntax/structure to load attachment files

      email.send({
        author: AUTHOR_ID, // who send email
        recipients: [AUTHOR_ID], // who get email
        subject: 'TEST.. email from Suitelet',
        body: 'Some text.. and?',
        attachments: [attachmentFile], // expected.. an array with "file.File" objects
      });

      response.write('Success: Email has been sent successfully!'); // output in browser tab (after trigger by deployment URL)
    } catch (e) {
      log.error({
        title: `${SCRIPT_FILENAME}: onRequest`,
        details: e,
      });
      response.write(`Error sending email: ${e.message}`);
    }
  };

  return { onRequest };
});
