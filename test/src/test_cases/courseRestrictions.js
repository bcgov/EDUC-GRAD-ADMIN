import { base_url, api_html_status_threshold } from '../config/constants';
import { RequestLogger, Selector } from 'testcafe';
import { apiCallsFailed } from '../helpers/requestHelper';
import adminUser from '../config/roles';
import CoursesPage from '../page_objects/coursesPage';
import commonUtils from '../helpers/commonUtils.js';

const log = require('npmlog');
const requestLogger = RequestLogger(/api\/v1/, {logResponseBody: true, logResponseHeaders: true});
const coursesPage = new CoursesPage();

fixture `course-restrictions`
    .page(base_url)
    .beforeEach( async t => {
        await t
            .useRole(adminUser)
            .navigateTo(base_url)
            .click('#courses-route')
            .click(coursesPage.restrictionsTab);
    })
    .afterEach(() => log.info(apiCallsFailed(requestLogger, api_html_status_threshold)));

    test('table loads', async t => {
        await t
        .expect(coursesPage.courseRestrictionsTable.exists).ok();
    });

    test('table sorting', async t => {

        const maxCols = 6;
        const maxRows = 20; //use this until pagnation

        for (let index = 0; index < maxCols * 2; index++) {
            let row = 1;
            let col = Math.floor(index / 2) + 1;

            // clicks on column header to sort
            await t.click(Selector(`th[role=columnheader][aria-colindex="${col}"] div`));
            
            while (row <= maxRows) {
                let prevCell = await coursesPage.getCellValue(col, row);
                row++;
                let curCell = await coursesPage.getCellValue(col, row);

                // cols 3 and 5 are singled out beause they are sorted descending order
                // this logic can be simplified
                if (index % 2 == 0 && (col != 3 && col != 5) || index % 2 == 1 && (col == 3 || col == 5)) {
                    await t.expect(commonUtils.isAscending(curCell, prevCell)).ok(`index: ${index}, col: ${col} and row: ${row}\nExpected "${prevCell}" to be less than "${curCell}"`);
                    
                } else {
                    await t.expect(commonUtils.isDescending(curCell, prevCell)).ok(`index: ${index}, col: ${col} and row: ${row}\nExpected "${prevCell}" to be greater than "${curCell}"`);
                    
                }
            }
        }
        
    })
