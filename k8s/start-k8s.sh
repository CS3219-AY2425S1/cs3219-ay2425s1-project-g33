DIR="."

# Apply all YAML files in the k8s folder
for file in $DIR/**/*.yaml; do
    kubectl apply -f $file
done

echo "All services have been applied."
