const { google } = require('googleapis');
const roundTo = require('round-to');

const SPREADSHEET_ID = '1eKWXDwcwMiMdxkj5uWPWgIQ5Vk8Gzic1vFg5YOCf-m8';

/**
 * Update the students grades and theirs situations
 * @see https://docs.google.com/spreadsheets/d/1eKWXDwcwMiMdxkj5uWPWgIQ5Vk8Gzic1vFg5YOCf-m8
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function updateGrades(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  /**
   * Request the sheet information
   */
  sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'A4:F',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;

    if (rows.length) {
      let cellValues = [];

      /**
       * Map all the rows returned from the sheet and generate
       * the new information
       */
      rows.map((row) => {
        let values = [];

        if(row[2] > 60 * 0.25) {
          values.push('Reprovado por Falta');
          values.push(0);
          cellValues.push(values);
          return;
        }

        const grade = (parseInt(row[3]) + parseInt(row[4]) + parseInt(row[5])) / 3;

        if(grade < 50) {
          values.push('Reprovado por nota');
          values.push(0);
          cellValues.push(values);
          return;
        } else if(grade > 70) {
          values.push('Aprovado');
          values.push(0);
          cellValues.push(values);
          return;
        } else {
          values.push('Exame final');

          let naf = roundTo.up((2 * 50) - grade, 2);

          values.push(naf);
          cellValues.push(values);
        }
      });

      /**
       * Create a resource with the new information pushed into cellValues
       */
      const resource = { values: cellValues };

      // Update configs
      const updateOptions = {
        spreadsheetId: SPREADSHEET_ID,
        range: '!G4:H',
        valueInputOption: 'USER_ENTERED',
        resource
      };
      

      /**
       * Do the update and return the number of rows updated
       */
      sheets.spreadsheets.values.update(
        updateOptions, 
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log('The grade of %d students was updated.', result.data.updatedRows);
          }
      });
    } else {
      console.log('No data found.');
    }
  });

}

module.exports = { updateGrades };