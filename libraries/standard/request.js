export default class @request {

    static namespace = @namespace;
    /**
     * Get the validation rules that apply to the request.
     *
     * @return Object<string, string>
     */
    rules(request)
    {
        return {};
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return Object<string, string>
     */
    messages()
    {
        return {};
    }
}