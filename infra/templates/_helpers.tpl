{{- /*
Labels every resource carries. Each template adds its own
app.kubernetes.io/name (and component) next to this.
*/}}
{{- define "platform.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/part-of: {{ .Chart.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- /* Public hostname for a route: <subdomain>.<gateway.domain> */}}
{{- define "platform.host" -}}
{{- printf "%s.%s" .sub .root.Values.gateway.domain -}}
{{- end }}

{{- /* Names shared between templates (service DNS names etc.) */}}
{{- define "platform.elasticsearch" -}}{{ .Release.Name }}-elk-elasticsearch{{- end }}
{{- define "platform.logstash" -}}{{ .Release.Name }}-elk-logstash{{- end }}
{{- define "platform.kibana" -}}{{ .Release.Name }}-elk-kibana{{- end }}
{{- define "platform.prometheus" -}}{{ .Release.Name }}-prometheus{{- end }}
