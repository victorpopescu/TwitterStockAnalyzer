$(document).ready(function () 
{
    generateCharts("intel");
    generateCharts("ibm");
    generateCharts("cisco");
});

function generateCharts(company)
{
    // SentiWordNet
    $.ajax(
    {
        type: "GET",
        async: false,
        url: "../generated/" + company + "_sentiwordnet.txt",
        dataType: "json",
        success: function (data)
        {
            SentiWordNetRaw = data;
        }
    });

    SentiWordNetLabels = Object.keys(SentiWordNetRaw).sort();
    SentiWordNetPositivity = [];
    SentiWordNetNegativity = [];
    for (i = 0; i < SentiWordNetLabels.length; i++)
    {
        values = SentiWordNetRaw[SentiWordNetLabels[i]];
        positivity = 0;
        negativity = 0;
        for (j = 0; j < values.length; j++)
        {
            positivity += values[j].positive;
            negativity += values[j].negative;
        }

        SentiWordNetPositivity.push(Math.round(positivity));
        SentiWordNetNegativity.push(Math.round(negativity));
    }

    SentiWordNetContext = $("." + company + ".sentiwordnet").get(0).getContext("2d");
    SentiWordNetData = {
    labels: SentiWordNetLabels,
        datasets: [
        {
            label: "Positivity",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: SentiWordNetPositivity
        },
        {
            label: "Negativity",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: SentiWordNetNegativity
        }
    ]
    };
    new Chart(SentiWordNetContext).Line(SentiWordNetData, {});

    // TextBlob
    $.ajax(
    {
        type: "GET",
        async: false,
        url: "../generated/" + company + "_textblob.txt",
        dataType: "json",
        success: function (data)
        {
            TextBlobRaw = data;
        }
    });

    TextBlobLabels = Object.keys(TextBlobRaw).sort();
    TextBlobPolarity = [];
    for (i = 0; i < TextBlobLabels.length; i++)
    {
        values = TextBlobRaw[TextBlobLabels[i]];
        polarity = 0;
        for (j = 0; j < values.length; j++)
        {
            polarity += values[j].polarity;
        }

        TextBlobPolarity.push(Math.round(polarity));
    }

    TextBlobContext = $("." + company + ".textblob").get(0).getContext("2d");
    TextBlobData = {
    labels: TextBlobLabels,
        datasets: [
        {
            label: "Polarity",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: TextBlobPolarity
        }]
    };
    new Chart(TextBlobContext).Line(TextBlobData, {});

    // Smileys
    $.ajax(
    {
        type: "GET",
        async: false,
        url: "../generated/" + company + "_smileys.txt",
        dataType: "json",
        success: function (data)
        {
            SmileysRaw = data;
        }
    });

    SmileysLabels = Object.keys(SmileysRaw).sort();
    SmileysSmile = [];
    for (i = 0; i < SmileysLabels.length; i++)
    {
        values = SmileysRaw[SmileysLabels[i]];
        smile = 0;
        for (j = 0; j < values.length; j++)
        {
            smile += values[j].sentiment;
        }

        SmileysSmile.push(Math.round(smile));
    }

    SmileysContext = $("." + company + ".smileys").get(0).getContext("2d");
    SmileysData = {
    labels: SmileysLabels,
        datasets: [
        {
            label: "Smile Score",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: SmileysSmile
        }]
    };
    new Chart(SmileysContext).Line(SmileysData, {});

    // Combined
    CombinedContext = $("." + company + ".combined").get(0).getContext("2d");
    CombinedData = {
    labels: SentiWordNetLabels,
        datasets: [
        {
            label: "Positivity",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: normalize(SentiWordNetPositivity)
        },
        {
            label: "Negativity",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: normalize(SentiWordNetNegativity)
        },
        {
            label: "Polarity",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: normalize(TextBlobPolarity)
        },
        {
            label: "Smile",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: normalize(SmileysSmile)
        }]
    };
    new Chart(CombinedContext).Line(CombinedData, {});
}

function normalize(data)
{
    var minimum = Math.min.apply(Math, data);

    for (i = 0; i < data.length; i++)
    {
        data[i] -= minimum;
    }

    var maximum = Math.max.apply(Math, data);

    for (i = 0; i < data.length; i++)
    {
        data[i] = data[i] / maximum;
    }

    return data;
}
