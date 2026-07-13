const fs = require('fs');

['app/Models/InvoiceItem.php', 'app/Models/PurchaseOrderItem.php'].forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    
    // Using a safer replace method
    if (!code.includes('math_operator')) {
        code = code.replace(/'unit_price',/g, "'unit_price',\n        'math_operator',\n        'math_operand',");
        fs.writeFileSync(file, code);
        console.log('Updated ' + file);
    } else {
        console.log('Already updated ' + file);
    }
});

['app/Http/Controllers/Api/InvoiceController.php', 'app/Http/Controllers/Api/PurchaseOrderController.php'].forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    
    if (!code.includes('math_operator')) {
        code = code.replace(/'unit_price'\s*=>\s*\$item\['unit_price'\]\s*\?\?\s*0,/g, "'unit_price'     => $item['unit_price'] ?? 0,\n                    'math_operator'  => $item['math_operator'] ?? null,\n                    'math_operand'   => $item['math_operand'] ?? null,");
        fs.writeFileSync(file, code);
        console.log('Updated controller: ' + file);
    } else {
        console.log('Already updated ' + file);
    }
});
