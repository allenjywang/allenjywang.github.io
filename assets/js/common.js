$(document).ready(function() {
    $('a.abstract').click(function() {
        $(this).parent().parent().find(".abstract.hidden").toggleClass('open');
        $(this).parent().parent().find(".bibtex.hidden.open").toggleClass('open');
    });
    $('a.bibtex').click(function() {
        $(this).parent().parent().find(".bibtex.hidden").toggleClass('open');
        $(this).parent().parent().find(".abstract.hidden.open").toggleClass('open');
    });
    $('a').removeClass('waves-effect waves-light');

    const mediaQuery = window.matchMedia('(min-width: 576px)');
    const equalizedRows = $('.post article .row, .post-content .row').filter(function() {
        return $(this).find('figure img').length > 1;
    });

    function resetRow($row) {
        $row.removeClass('equalized-media-row');
        $row.find('figure').removeClass('equalized-media-figure');
        $row.find('figure img').css({
            height: '',
            width: '',
            'max-width': '',
            'max-height': ''
        });
    }

    function equalizeRow($row) {
        const $images = $row.find('> [class*="col"] figure img');
        if ($images.length < 2) {
            resetRow($row);
            return;
        }

        if (!mediaQuery.matches) {
            resetRow($row);
            return;
        }

        let pendingImage = false;
        const imageData = [];

        $images.each(function() {
            const img = this;
            if (!img.complete || !img.naturalWidth || !img.naturalHeight) {
                pendingImage = true;
                return false;
            }

            const $column = $(img).closest('[class*="col"]');
            const columnWidth = $column.width();
            if (!columnWidth) {
                return;
            }

            imageData.push({
                img,
                scaledHeight: columnWidth * (img.naturalHeight / img.naturalWidth)
            });
        });

        if (pendingImage || imageData.length !== $images.length) {
            return;
        }

        const targetHeight = Math.floor(Math.min(...imageData.map((item) => item.scaledHeight)));
        if (!Number.isFinite(targetHeight) || targetHeight <= 0) {
            resetRow($row);
            return;
        }

        $row.addClass('equalized-media-row');
        $row.find('> [class*="col"] figure').addClass('equalized-media-figure');

        imageData.forEach(({ img }) => {
            $(img).css({
                height: `${targetHeight}px`,
                width: '100%',
                'max-width': '100%',
                'max-height': 'none'
            });
        });
    }

    function equalizeProjectMediaRows() {
        equalizedRows.each(function() {
            equalizeRow($(this));
        });
    }

    equalizeProjectMediaRows();

    $(window).on('resize', equalizeProjectMediaRows);
    equalizedRows.find('img').on('load', equalizeProjectMediaRows);
});
