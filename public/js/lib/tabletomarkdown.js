function process_table(html){

    // set the strings to hold the data
    var markdown_string = "";
    var table_header = "|";
    var table_header_footer = "|";
    var table_rows = "";
    var table_header_found = false;

    // if there is a thread we append
    $(html).find('thead > tr > td').each(function() {
        if($(this).text().trim() != ""){
            table_header = table_header + $(this).text().trim().replace('\n','') + "|";
            table_header_footer = table_header_footer + "--- |";
            table_header_found = true;
        }
    });

    // loop all the rows
    $(html).find('tr').each(function() {
        // get the header if present
        $(this).find('th').each(function() {
            if($(this).text() != ""){
                table_header = table_header + $(this).text() + "|";
                table_header_footer = table_header_footer + "--- |";
                table_header_found = true;
            }
        });

        // get the cells if they are not in thead
        var table_row = "";
        $(this).find('td').not("thead > tr > td").each(function() {
            //console.log($(this).text());
            if($(this).text() != ""){
                table_row = table_row + $(this).text().trim() + "|";
            }
        });

        // only add row if its got data
        if(table_row != ""){
            table_rows += "|" + table_row + "\n"
        }
    });

    // if table header exists
    if(table_header_found == true){
        markdown_string += table_header + "\n";
        markdown_string += table_header_footer + "\n";
    }

    // add all the rows
    markdown_string += table_rows;

    return markdown_string;
}