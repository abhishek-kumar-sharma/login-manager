import { LightningElement, api, track } from 'lwc';

export default class DataTableLwc extends LightningElement {
    @api flexipageRegionWidth;
    tableHeading = 'Hello World'; // table heading

    //Entries controlling attribute section start
    disableEntriesOptions = false; // enable/disable the select box for entries
    @track entriesOptions = [
        { label: '5', value: '5' },
        { label: '10', value: '10' },
        { label: '15', value: '15' },
        { label: '20', value: '20' }
    ]; // entries select options values
    //Entries controlling attribute section end

    // Search input box controlling attribute section start
    searchString; // Attribute to hold the value for search input
    disableSearchBox = false; // Attribute to enable/disable the search box
    // Search input box controlling attribute section end

    /**
     * Connected call back to initialize the values
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       24 June 2020
     */
    connectedCallback() {
        try {

        } catch (error) {
            console.error('Error occurred while initalizing the data table. \n Message ::', error);
        }
    }

    /**
     * Method to handle the entries option change
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       24 June 2020
     */
    handleShowEntriesChange() {
        try {

        } catch (error) {
            console.error('Error while handling the change entries. \n Message ::', error);

        }
    }

    /**
     * Method to handle the changes in the search box at top of the table
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       24 June 2020
     */
    handleSearchStringChange() {
        try {

        } catch (error) {
            console.log('Error while handling the search string change. \n Message ::', error);
        }
    }
}