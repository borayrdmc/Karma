function extractProductData(html:string){

    const sharedPropsText = 'window["__envoy__SHARED_PROPS"]=';
    const startIndexOfPropsText = html.indexOf(sharedPropsText);

    if(startIndexOfPropsText===-1){
        throw new Error("SHARED PROPS not found. Check HTML for changes.");
    }

    const startIndexOfJson = startIndexOfPropsText+sharedPropsText.length;

    const lastIndexOfJson = html.indexOf('</script>',startIndexOfJson);

    if(lastIndexOfJson===-1){
        throw new Error("</script> tag not found. Check HTML for changes.")
    }

    const rawStringJSON = html.slice(startIndexOfJson,lastIndexOfJson).trim();
    const productDataJSON = JSON.parse(rawStringJSON);

    return productDataJSON;
}