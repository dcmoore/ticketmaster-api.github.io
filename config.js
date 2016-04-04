var venueDetails = function (version, isPrimary, notExpandable) {
    var mapAddress = [ // if lat or long are not specified, map will be generated by address
        {
          "id": "line1",
          "path": "address"
        },
        {
          "id": "line2",
          "path": "address"
        },
        {
          "id": "name",
          "path": "city"
        },
        {
          "id": "name",
          "path": "country"
        }
      ],
      fields = [
        {
          "id": "line1",
          "path": "address"
        },
        {
          "id": "line2",
          "path": "address"
        },
        {
          "id": "name",
          "path": "city"
        },
        {
          "id": "countryCode",
          "path": "country"
        },
        {
          "id": "latitude",
          "path": "location"
        },
        {
          "id": "longitude",
          "path": "location"
        }
      ];

    var returnObj =  [
      {
        "title": "Venue",
        "path": (isPrimary ? "" : "_embedded.venue" + (version ? "s" : "")),
        "expandsTo": "discovery." + (version ? (version + ".") : "") + "venues.id.get",
        "fields": [
          {
            "id": "id"
          },
          {
            "id": "name"
          },
          {
            "id": "postalCode"
          },
          {
            "id": "timezone"
          }
        ]
      },
      {
        "title": "Address",
        "path": (isPrimary ? "" : "_embedded.venue" + (version ? "s" : "")),
        "map": { // available only for subcolumn (not collections)
          "coordinates": {
            "latitude": "latitude",
            "longitude": "longitude",
            "path": "location"
          },
          "address": mapAddress
        },
        "fields": fields
      }
    ];

    if (notExpandable)
      delete returnObj[0].expandsTo;

    return returnObj;
  },

  categoryDetails = function(version) {
    return [
      {
        "title": "Category",
        "path": "_embedded.categories",
        "expandsTo": "discovery." + (version ? (version + ".") : "") + "categories.id.get",
        "fields": [
          {
            "id": "id"
          },
          {
            "id": "level"
          },
          {
            "id": "name"
          },
          {
            "id": "locale"
          }
        ]
      }
    ]
  },

  attractionDetails = function(version, isPrimary, notExpandable){
    var attrObj = [
      {
        "title": "Attraction",
        "path": (isPrimary ? "" : "_embedded.attractions"),
        "expandsTo": "discovery." + (version ? (version + ".") : "") + "attractions.id.get",
        "fields": [
          {
            "id": "id"
          },
          {
            "id": "name"
          },
          {
            "id": "locale"
          }
        ]
      }
    ];

    if (notExpandable)
      delete attrObj[0].expandsTo;

    if (version) {
      attrObj.push({
        "title": "Images",
        "path": (isPrimary ? "" : "_embedded.attractions"),
        "collection": true,
        "fields": [
          {
            "id": "ratio",
            "path": "images",
            "thumbnail" : { // if thumbnail is shown. if this field is present - image pop-up will show on click
              "id" : "url", // name of the field with url
              "path" : '' // path to field with src
            },
            "expandsTo": [
              {
                "title": "Image", // subcolumn title (required)
                "path": "images", // path to fields (required)
                "fields": [ // if collection is true there should be only 1 field to iterate through (required)
                  {
                    "id": "ratio",
                    "thumbnail" : { // if thumbnail is shown. if this field is present - image pop-up will show on click
                      "id" : "url", // name of the field with url
                      "path" : '' // path to field with src
                    }
                  },
                  {
                    "id": "url"
                  },
                  {
                    "id": "height"
                  },
                  {
                    "id": "width"
                  },
                  {
                    "id": "fallback"
                  }
                ]
              }
            ]
          }
        ]
      });

      attrObj.push({
        "title": "Classifications",
        "path": (isPrimary ? "" : "_embedded.attractions"),
        "collection": true,
        "fields": [{
          "path": "classifications",
          "expandsTo": classificationDetails(true, "classifications", true)
        }]
      });
    }

    return attrObj;
  },

  classificationDetails = function(isComplete, path, isExpandable) {
    var returnObj = [
      {
        "title": "Segment", // subcolumn title (required)
        "path": path, // path to fields (required)
        "fields": [
          {
            "id": "name",
            "path": "segment"
          },
          {
            "id": "id",
            "path": "segment"
          }
        ]
      }
    ];

    if (isExpandable)
      returnObj[0]["expandsTo"] = "discovery.v2.classifications.id.get";

    if (isComplete) {
      returnObj.push(
        {
          "title": "Genre", // subcolumn title (required)
          "path": path, // path to fields (required)
          "fields": [
            {
              "id": "name",
              "path": "genre"
            },
            {
              "id": "id",
              "path": "genre"
            }
          ]
        }
      );
      returnObj.push(
        {
          "title": "SubGenre", // subcolumn title (required)
          "path": path, // path to fields (required)
          "fields": [
            {
              "id": "name",
              "path": "subGenre"
            },
            {
              "id": "id",
              "path": "subGenre"
            }
          ]
        })
    }

    return returnObj;
  },

  pageDetails = {
    "title": "Page",
    "path": "page",
    "fields": [
      {
        "id": "size"
      },
      {
        "id": "totalElements"
      },
      {
        "id": "totalPages"
      },
      {
        "id": "number"
      }
    ]
  };

var CONFIG = {
  "discovery.events.get": [
    { // subcolumn
      "title": "Events", // subcolumn title (required)
      "path": "_embedded.events", // path to fields (required)
      "collection": true, // if array (not required)
      "fields": [ // if collection is true there should be only 1 field to iterate through (required)
        {
          "id": "name",
          "expandsTo": [
            { // subcolumn
              "title": "Event",
              "path": "_embedded.events",
              "expandsTo": "discovery.events.id.get",
              "fields": [
                {
                  "id": "id"
                },
                {
                  "id": "locale"
                },
                {
                  "id": "name"
                }
              ]
            },
            {
              "title": "Dates",
              "path": "_embedded.events",
              "fields": [
                {
                  "id": "localDate",
                  "path": "dates.start"
                },
                {
                  "id": "localDate",
                  "path": "dates.end"
                },
                {
                  "id": "timezone",
                  "path": "dates"
                },
                {
                  "id": "code",
                  "path": "dates.status"
                }
              ]
            },
            {
              "title": "Venues",
              "path": "_embedded.events",
              "collection": true,
              "fields": [
                {
                  "id": "name",
                  "path": "_embedded.venue",
                  "expandsTo": venueDetails()
                }
              ]
            },
            {
              "title": "Categories",
              "path": "_embedded.events",
              "collection": true,
              "fields": [
                {
                  "id": "name",
                  "path": "_embedded.categories",
                  "expandsTo" : categoryDetails()
                }
              ]
            },
            {
              "title": "Attractions",
              "path": "_embedded.events",
              "collection": true,
              "fields": [
                {
                  "id": "name",
                  "path": "_embedded.attractions",
                  "expandsTo": attractionDetails()
                }
              ]
            }
          ]
        }
      ]
    },
    pageDetails
  ],
  "discovery.events.id.get": [
    {
      "title": "Events details", // subcolumn title (required)
      "path": "", // path to fields (required)
      "fields": [ // if collection is true there should be only 1 field to iterate through (required)
        {
          "id": "id"
        },
        {
          "id": "locale"
        },
        {
          "id": "name"
        },
        {
          "id": "0",
          "path" : "promoterId"
        }
      ]
    },
    {
      "title": "Dates",
      "path": "dates",
      "fields": [
        {
          "id": "localDate",
          "path": "start"
        },
        {
          "id": "timezone"
        },
        {
          "id": "code",
          "path": "status"
        }
      ]
    },
    {
      "title": "Venues",
      "path": "_embedded.venue",
      "collection": true,
      "fields": [
        {
          "id": "name",
          "expandsTo": venueDetails()
        }
      ]
    },
    {
      "title": "Categories",
      "path": "_embedded.categories",
      "collection": true,
      "fields": [
        {
          "id": "name",
          "expandsTo": categoryDetails()
        }
      ]
    },
    {
      "title": "Attractions",
      "path": "_embedded.attractions",
      "collection": true,
      "fields": [
        {
          "id": "name",
          "expandsTo": attractionDetails()
        }
      ]
    },
    {
      "title": "Get Images",
      "path": "",
      "expandsTo": "discovery.events.id.images.get"
    }
  ],
  "discovery.events.id.images.get": [
    {
      "title": "Event", // subcolumn title (required)
      "path": "", // path to fields (required)
      "fields": [ // if collection is true there should be only 1 field to iterate through (required)
        {
          "id": "id"
        }
      ]
    },
    {
      "title": "Images", // subcolumn title (required)
      "path": "images", // path to fields (required)
      "collection": true,
      "fields": [ // if collection is true there should be only 1 field to iterate through (required)
        {
          "id": "ratio",
          "thumbnail" : { // if thumbnail is shown. if this field is present - image pop-up will show on click
            "id" : "url", // name of the field with url
            "path" : '' // path to field with src
          },
          "expandsTo": [
            {
              "title": "Image", // subcolumn title (required)
              "path": "images", // path to fields (required)
              "fields": [ // if collection is true there should be only 1 field to iterate through (required)
                {
                  "id": "ratio",
                  "thumbnail" : { // if thumbnail is shown. if this field is present - image pop-up will show on click
                    "id" : "url", // name of the field with url
                    "path" : '' // path to field with src
                  }
                },
                {
                  "id": "url"
                },
                {
                  "id": "height"
                },
                {
                  "id": "width"
                },
                {
                  "id": "fallback"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "discovery.attractions.get": [
    {
      "title": "Attractions", // subcolumn title (required)
      "path": "_embedded.attractions", // path to fields (required)
      "collection": true,
      "fields": [ // if collection is true there should be only 1 field to iterate through (required)
        {
          "id": "name",
          "expandsTo": attractionDetails()
        }
      ]
    },
    pageDetails
  ],
  "discovery.attractions.id.get": [
    {
      "title": "Attraction Details", // subcolumn title (required)
      "path": "", // path to fields (required)
      "fields": [ // if collection is true there should be only 1 field to iterate through (required)
        {
          "id": "locale"
        },
        {
          "id": "name"
        },
        {
          "id": "id"
        }
      ]
    }
  ],
  "discovery.categories.get": [
    {
      "title": "Categories", // subcolumn title (required)
      "path": "_embedded.categories", // path to fields (required)
      "collection": true,
      "fields": [ // if collection is true there should be only 1 field to iterate through (required)
        {
          "id": "name",
          "expandsTo": categoryDetails()
        }
      ]
    },
    pageDetails
  ],
  "discovery.categories.id.get": [
    {
      "title": "Category",
      "path": "",
      "fields": [
        {
          "id": "id"
        },
        {
          "id": "level"
        },
        {
          "id": "name"
        },
        {
          "id": "locale"
        }
      ]
    }
  ],
  "discovery.venues.get": [
    {
      "title": "Venues",
      "path": "_embedded.venues", // venueS (not venue)
      "collection": true,
      "fields": [
        {
          "id": "name",
          "expandsTo": [
            {
              "title": "Venue",
              "path": "_embedded.venues",
              "expandsTo": "discovery.venues.id.get",
              "fields": [
                {
                  "id": "id"
                },
                {
                  "id": "name"
                },
                {
                  "id": "postalCode"
                },
                {
                  "id": "timeZone"
                }
              ]
            },
            {
              "title": "Address",
              "path": "_embedded.venues",
              "map": { // available only for subcolumn (not collections)
                "coordinates" : {
                  "latitude" : "latitude",
                  "longitude" : "longitude",
                  "path" : "location"
                },
                "address" : [ // if lat or long are not specified, map will be generated by address
                  {
                    "id" : "line1",
                    "path" : "address"
                  },
                  {
                    "id" : "line2",
                    "path" : "address"
                  }
                ]
              },
              "fields": [
                {
                  "id": "line1",
                  "path": "address"
                },
                {
                  "id": "line2",
                  "path": "address"
                },
                {
                  "id": "name",
                  "path": "city"
                },
                {
                  "id": "countryCode",
                  "path": "country"
                }
              ]
            }
          ]
        }
      ]
    },
    pageDetails
  ],
  "discovery.venues.id.get": [
    {
      "title": "Venue",
      "path": "",
      "fields": [
        {
          "id": "id"
        },
        {
          "id": "name"
        },
        {
          "id": "postalCode"
        },
        {
          "id": "timeZone"
        },
        {
          "id": "locale"
        }
      ]
    },
    {
      "title": "Address",
      "path": "",
      "map": { // available only for subcolumn (not collections)
        "coordinates" : {
          "latitude" : "latitude",
          "longitude" : "longitude",
          "path" : "location"
        },
        "address" : [ // if lat or long are not specified, map will be generated by address
          {
            "id" : "line1",
            "path" : "address"
          },
          {
            "id" : "line2",
            "path" : "address"
          }
        ]
      },
      "fields": [
        {
          "id": "line1",
          "path": "address"
        },
        {
          "id": "line2",
          "path": "address"
        },
        {
          "id": "name",
          "path": "city"
        },
        {
          "id": "countryCode",
          "path": "country"
        }
      ]
    }
  ],
  "discovery.v2.events.get": [
    { // subcolumn
      "title": "Events", // subcolumn title (required)
      "path": "_embedded.events", // path to fields (required)
      "collection": true, // if array (not required)
      "fields": [ // if collection is true there should be only 1 field to iterate through (required)
        {
          "id": "name",
          "expandsTo": [
            { // subcolumn
              "title": "Event",
              "path": "_embedded.events",
              "expandsTo": "discovery.v2.events.id.get",
              "fields": [
                {
                  "id": "id"
                },
                {
                  "id": "url"
                },
                {
                  "id": "locale"
                },
                {
                  "id": "name"
                },
                {
                  "id": "test"
                }
              ]
            },
            {
              "title": "Dates",
              "path": "_embedded.events",
              "fields": [
                {
                  "id": "localDate",
                  "path": "dates.start"
                },
                {
                  "id": "localTime",
                  "path": "dates.start"
                },
                {
                  "id": "timezone",
                  "path": "dates"
                },
                {
                  "id": "code",
                  "path": "dates.status"
                }
              ]
            },
            {
              "title": "Images",
              "path": "_embedded.events",
              "collection": true,
              "fields": [
                {
                  "id": "ratio",
                  "path": "images",
                  "thumbnail" : { // if thumbnail is shown. if this field is present - image pop-up will show on click
                    "id" : "url", // name of the field with url
                    "path" : '' // path to field with src
                  },
                  "expandsTo": [
                    {
                      "title": "Image", // subcolumn title (required)
                      "path": "images", // path to fields (required)
                      "fields": [ // if collection is true there should be only 1 field to iterate through (required)
                        {
                          "id": "ratio",
                          "thumbnail" : { // if thumbnail is shown. if this field is present - image pop-up will show on click
                            "id" : "url", // name of the field with url
                            "path" : '' // path to field with src
                          }
                        },
                        {
                          "id": "url"
                        },
                        {
                          "id": "height"
                        },
                        {
                          "id": "width"
                        },
                        {
                          "id": "fallback"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "title": "Venues",
              "path": "_embedded.events",
              "collection": true,
              "fields": [
                {
                  "id": "name",
                  "path": "_embedded.venues",
                  "expandsTo": venueDetails('v2')
                }
              ]
            },
            {
              "title": "Attractions",
              "path": "_embedded.events",
              "collection": true,
              "fields": [
                {
                  "id": "name",
                  "path": "_embedded.attractions",
                  "expandsTo": attractionDetails('v2')
                }
              ]
            },
            {
              "title": "Classifications",
              "path": "_embedded.events",
              "collection": true,
              "fields": [{
                "path": "classifications",
                "expandsTo": classificationDetails(true, "classifications", true)
              }]
            }
          ]
        }
      ]
    },
    pageDetails
  ],
  "discovery.v2.events.id.get": [
    { // subcolumn
      "title": "Event Details",
      "path": '',
      "fields": [
        {
          "id": "id"
        },
        {
          "id": "url"
        },
        {
          "id": "locale"
        },
        {
          "id": "name"
        },
        {
          "id": "test"
        }
      ]
    },
    {
      "title": "Dates",
      "path": 'dates',
      "fields": [
        {
          "id": "localDate",
          "path": "start"
        },
        {
          "id": "localTime",
          "path": "start"
        },
        {
          "id": "timezone"
        },
        {
          "id": "code",
          "path": "status"
        }
      ]
    },
    {
      "title": "Images",
      "path": "images",
      "collection": true,
      "fields": [
        {
          "id": "ratio",
          "path": "",
          "thumbnail" : { // if thumbnail is shown. if this field is present - image pop-up will show on click
            "id" : "url", // name of the field with url
            "path" : '' // path to field with src
          },
          "expandsTo": [
            {
              "title": "Image", // subcolumn title (required)
              "path": "images", // path to fields (required)
              "fields": [ // if collection is true there should be only 1 field to iterate through (required)
                {
                  "id": "ratio",
                  "thumbnail" : { // if thumbnail is shown. if this field is present - image pop-up will show on click
                    "id" : "url", // name of the field with url
                    "path" : '' // path to field with src
                  }
                },
                {
                  "id": "url"
                },
                {
                  "id": "height"
                },
                {
                  "id": "width"
                },
                {
                  "id": "fallback"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "title": "Venues",
      "path": "_embedded.venues",
      "collection": true,
      "fields": [
        {
          "id": "name",
          "path": "",
          "expandsTo": venueDetails('v2')
        }
      ]
    },
    {
      "title": "Attractions",
      "path": "_embedded.attractions",
      "collection": true,
      "fields": [
        {
          "id": "name",
          "path": "",
          "expandsTo": attractionDetails('v2')
        }
      ]
    },
    {
      "title": "Classifications",
      "path": "classifications",
      "collection": true,
      "fields": [{
        "path": "",
        "expandsTo": classificationDetails(true, "classifications", true)
      }]
    }
  ],
  "discovery.v2.events.id.images.get": [
    {
      "title": "Event", // subcolumn title (required)
      "path": "", // path to fields (required)
      "fields": [ // if collection is true there should be only 1 field to iterate through (required)
        {
          "id": "id"
        }
      ]
    },
    {
      "title": "Images", // subcolumn title (required)
      "path": "images", // path to fields (required)
      "collection": true,
      "fields": [ // if collection is true there should be only 1 field to iterate through (required)
        {
          "id": "ratio",
          "thumbnail" : { // if thumbnail is shown. if this field is present - image pop-up will show on click
            "id" : "url", // name of the field with url
            "path" : '' // path to field with src
          },
          "expandsTo": [
            {
              "title": "Image", // subcolumn title (required)
              "path": "images", // path to fields (required)
              "fields": [ // if collection is true there should be only 1 field to iterate through (required)
                {
                  "id": "ratio",
                  "thumbnail" : { // if thumbnail is shown. if this field is present - image pop-up will show on click
                    "id" : "url", // name of the field with url
                    "path" : '' // path to field with src
                  }
                },
                {
                  "id": "url"
                },
                {
                  "id": "height"
                },
                {
                  "id": "width"
                },
                {
                  "id": "fallback"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "discovery.v2.attractions.get": [
    {
      "title": "Attractions", // subcolumn title (required)
      "path": "_embedded.attractions", // path to fields (required)
      "collection": true,
      "fields": [ // if collection is true there should be only 1 field to iterate through (required)
        {
          "id": "name",
          "expandsTo": attractionDetails('v2')
        }
      ]
    },
    pageDetails
  ],
  "discovery.v2.attractions.id.get": attractionDetails('v2', true, true),
  "discovery.v2.classifications.get": [
    {
      "title": "Classifications",
      "path": "_embedded.classifications",
      "collection": true,
      "fields": [{
        "path": "",
        "expandsTo": classificationDetails(false, "_embedded.classifications", true)
      }]
    },
    pageDetails
  ],
  "discovery.v2.classifications.id.get": classificationDetails(false, "", false),
  "discovery.v2.venues.get": [
    {
      "title": "Venues",
      "path": "_embedded.venues", // venueS (not venue)
      "collection": true,
      "fields": [
        {
          "id": "name",
          "expandsTo": venueDetails("v2")
        }
      ]
    },
    pageDetails
  ],
  "discovery.v2.venues.id.get": venueDetails("v2", true, true),
  "commerce.events.offers": {},
  "tap.events": {}
};