from diagrams import Diagram, Cluster, Edge
from diagrams.aws.compute import ECS
from diagrams.aws.database import RDS
from diagrams.aws.network import Route53, ELB, InternetGateway
from diagrams.onprem.network import Internet
from diagrams.onprem.client import Users
from diagrams.aws.network import CloudFront
from diagrams.aws.storage import S3
from diagrams.aws.security import ACM

with Diagram("LogOrg", show=False):
    with Cluster("Internet"):
        internet = Internet("internet")
        users    = Users("User")

        with Cluster("AWS"):

            dns  = Route53("DNS")
            acm  = ACM("Certificate Manager")

            with Cluster("CDN/cdn.logorg.work"):

                cdn_front = CloudFront("CDN Front")
                cdn_storage = S3("Logorg Bucket")

            with Cluster("APP/VPC 10.0.0.0/www.logorg.work"):

                elb  = ELB("LB")
                igw  = InternetGateway("Internet Gateway")

                with Cluster("subnet-private"):
                    web  = ECS("LogOrg Rails+NGINX")
                    db   = RDS("Service DB(MySQL)")

                with Cluster("subnet-public"):
                    mail = ECS("Mailrelay(Postfix)")

    # 構成
    users - internet - dns >> igw - elb # ユーザーアクセス
    elb - web - db # LogOrg
    web >> mail >> igw

    # CDN
    dns >> cdn_front - cdn_storage
    web - cdn_storage

    # SSL
    acm >> elb
    acm >> cdn_front

