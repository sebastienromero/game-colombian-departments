import json
from pathlib import Path

path = Path("app/src/data/colombian-departments.json")
data = json.loads(path.read_text(encoding="utf-8"))
















# # c'est un dict
# print (type(data))
# print(data.keys())





# # features est une liste
# features = data["features"]
# # print("nombre de features :", len(features))
# # ROOT = Path(__file__).resolve().parent.parent
# # GEOJSON_PATH = ROOT / "src" / "data" / "colombian-departments.json"

# # premier élément
# first = features[0]
# # print(type(first))
# # print(first.keys())


# # propriétés du premier département
# print(first["properties"])
# # print("nom :", first["properties"]["name"])
# # print("capitale :", first["properties"].get("capital"))



# def is_empty_coordinates(coords):
#     if not isinstance(coords, list) or len(coords) == 0:
#         return True
#     return all(is_empty_coordinates(item) for item in coords)


# def main():
#     if not GEOJSON_PATH.exists():
#         raise FileNotFoundError(f"Fichier non trouvé : {GEOJSON_PATH}")

#     with GEOJSON_PATH.open("r", encoding="utf-8") as f:
#         data = json.load(f)

#     features = data.get("features", [])
#     print("GeoJSON type:", data.get("type"))
#     print("Nombre de features:", len(features))

#     geom_types = {}
#     empty_features = []

#     for feature in features:
#         props = feature.get("properties", {})
#         name = props.get("name", "<sans nom>")
#         capital = props.get("capital", "<sans capitale>")
#         geom = feature.get("geometry", {})
#         geom_type = geom.get("type")
#         coords = geom.get("coordinates")

#         geom_types[geom_type] = geom_types.get(geom_type, 0) + 1

#         if is_empty_coordinates(coords):
#             empty_features.append((name, props.get("id"), capital))

#     print("\nTypes de géométrie trouvés:")
#     for geom_type, count in geom_types.items():
#         print(f" - {geom_type}: {count}")

#     print(f"\nDépartements avec géométrie vide: {len(empty_features)}")
#     for name, dept_id, capital in empty_features:
#         print(f" - {name} ({dept_id}) -> {capital}")

#     print("\nExtrait département -> capitale:")
#     for feature in features[:20]:
#         props = feature.get("properties", {})
#         print(f" - {props.get('name')} -> {props.get('capital')}")


# if __name__ == "__main__":
#     main()
