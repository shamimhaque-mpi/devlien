import Controller from "devlien/controller";
import view from "devlien/view";

/**
 * DevlienController
 * This controller handles requests for the home or root page.
 */
export default class DevlienController extends Controller {
    constructor() {
        super();
        // Any setup or initialization can go here.
    }

    /**
     * Handle GET request for the root route ("/api/index").
     * @param {object} request - The HTTP request object containing query, headers, body, etc.
     * @return {string} A simple response string to confirm the controller is working.
     */
    async index(request) {
        return "I'm ready...";
    }

    /**
     * Handle GET request for the root route ("/").
     * @param {object} request - The HTTP request object containing query, headers, body, etc.
     * @return {string} A simple response string to confirm the controller is working.
     */
    async wellcome(request) {
        return await view('wellcome');
    }
}
