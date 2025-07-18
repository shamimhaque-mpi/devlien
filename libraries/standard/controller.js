import Controller from "devlien/controller";

/**
 * @controller
 * This controller handles requests for the home or root page.
 */
export default class @controller extends Controller {
    constructor() {
        super();
        // Any setup or initialization can go here.
    }

    /**
     * Handle GET request for the root route ("/").
     * @param {object} request - The HTTP request object containing query, headers, body, etc.
     * @return {string} A simple response string to confirm the controller is working.
     */
    index(request) {
        return "I'm ready...";
    }   
}
