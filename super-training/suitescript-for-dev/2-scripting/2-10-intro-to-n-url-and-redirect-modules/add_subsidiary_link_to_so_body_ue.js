/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 *
 * Add a "subsidiary" link to the "Sales Order" page in "View" mode, and add a "checkbox" in "Edit" mode (to redirect to the "subsidiary" page after "Save").
 */
define(['N/url', 'N/ui/serverWidget', 'N/redirect'], (
  url,
  serverWidget,
  redirect,
) => {
  const SCRIPT_FILENAME = 'add_subsidiary_link_to_so_body_ue';

  /**
   * @param {BeforeLoadContext} context
   * @return {void}
   */
  const beforeLoad = (context) => {
    try {
      // call both handlers.. each handler filters execution internally by "context.type" (below.. in own function)
      handleSubsidiaryLink(context);
      handleSubsidiaryRedirect(context);
    } catch (e) {
      log.error({
        title: `${SCRIPT_FILENAME}: beforeLoad`,
        details: e,
      });
    }
  };

  /**
   * @param {AfterSubmitContext} context
   * @return {void}
   */
  const afterSubmit = (context) => {
    try {
      const { type, newRecord, oldRecord, request } = context;

      // retrieve custom checkbox state from request parameters or newRecord
      const redirectToSubsidiary = request
        ? request.parameters.custpage_subsidiary_redirect === 'T'
        : newRecord.getValue({ fieldId: 'custpage_subsidiary_redirect' }) ===
            'T' ||
          newRecord.getValue({ fieldId: 'custpage_subsidiary_redirect' }) ===
            true;

      const subsidiaryId = newRecord.getValue({
        fieldId: 'subsidiary',
      });

      if (redirectToSubsidiary && subsidiaryId) {
        redirect.toRecord({
          id: subsidiaryId + '',
          type: 'subsidiary',
          isEditMode: false,
        });
      }
    } catch (e) {
      log.error({
        title: `${SCRIPT_FILENAME}: afterSubmit`,
        details: e,
      });
    }
  };

  const handleSubsidiaryLink = (context) => {
    const { type, newRecord, form, request } = context;

    if (type !== context.UserEventType.VIEW) return; // add link only in the "View" record mode (if "Edit".. isn't displayed)

    // get "subsidiary" internal ID (i.e. not the "text/company name".. namely "internal ID" (number))
    const subsidiaryId = newRecord.getValue({
      fieldId: 'subsidiary',
    });

    if (!subsidiaryId) return; // if "subsidiary" is not set (no internal ID).. return

    // get/generate a "subsidiary" URL based on the "internal ID"
    const subsidiaryUrl = url.resolveRecord({
      recordId: subsidiaryId,
      recordType: 'subsidiary',
      isEditMode: false,
    });

    // create a "custom" field with a link to the "subsidiary" page
    // !! ex. with "type/INLINEHTML" (allows/create.. your own link with any text)
    // form.addField({
    //   id: 'custpage_subsidiary_link',
    //   label: 'Subsidiary Link',
    //   type: serverWidget.FieldType.INLINEHTML,
    // }).defaultValue =
    //   `<a href="${subsidiaryUrl}" style="color: rgb(0, 104, 140); text-decoration: underline;">Link to a Subsidiary</a>`;

    const linkField = form.addField({
      id: 'custpage_subsidiary_link',
      label: 'Subsidiary Link',
      type: serverWidget.FieldType.URL,
    });

    linkField.defaultValue = subsidiaryUrl;
  };

  const handleSubsidiaryRedirect = (context) => {
    const { type, newRecord, form, request } = context;

    if (type !== context.UserEventType.EDIT) return; // add checkbox only in the "Edit" record mode (if "View".. isn't displayed)

    const checkboxField = form.addField({
      id: 'custpage_subsidiary_redirect',
      label: 'Subsidiary Redirect',
      type: serverWidget.FieldType.CHECKBOX,
    });

    // set checkbox default value to string 'F' ('T' or 'F' required for serverWidget checkbox fields)
    checkboxField.defaultValue = 'F';
  };

  return {
    beforeLoad,
    afterSubmit,
  };
});
